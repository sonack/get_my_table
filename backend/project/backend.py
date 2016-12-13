# !/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
from flask import Flask,request,session
from dbtools import DBTools
app = Flask(__name__)


# 注册
def valid_username(un):
    db = DBTools('root','liubixue','GetMyTable')
    db.connect()
    cursor = db.get_cursor()
    res = cursor.execute('select count(*) from User where username = %s',(un,))
    res = cursor.fetchall()
    print("数据库查询结果:" + str(res[0][0]))
    print(type(res[0][0]))
    if res[0][0] > 0:
        return False;
    return True;

@app.route("/is_name_valid",methods=["POST"])
def is_name_valid():
    un = request.form['username']
    print("username is " + un)
    if valid_username(un):
        return '{"status": "success"}'
    else:
        return '{"status": "failed"}'

def valid_email(em):
    db = DBTools('root','liubixue','GetMyTable')
    db.connect()
    cursor = db.get_cursor()
    res = cursor.execute('select count(*) from User where email = %s',(em,))
    res = cursor.fetchall()
    print("数据库查询结果:" + str(res[0][0]))
    print(type(res[0][0]))
    if res[0][0] > 0:
        return False;
    return True;

@app.route("/is_email_valid",methods=["POST"])
def is_email_valid():
    em = request.form['email']
    print("email is " + em)
    if valid_email(em):
        return '{"status": "success"}'
    else:
        return '{"status": "failed"}'

def add_new_user(un,pw,em):
    db = DBTools('root','liubixue','GetMyTable')
    conn = db.connect()
    cursor = db.get_cursor()
    try:
        cursor.execute('insert into User(username,password,email) values(%s,%s,%s)',(un,pw,em))
        conn.commit()
        return True
    except Exception:
        return False


@app.route("/register",methods=["POST"])
def register():
    un = request.form['username']
    pw = request.form['password']
    em = request.form['email']
    if add_new_user(un,pw,em):
        return '{"status": "success"}'
    else:
        return '{"status": "failed"}'

# 登录

def exist_user(un,pw):
    db = DBTools('root','liubixue','GetMyTable')
    db.connect()
    cursor = db.get_cursor()
    res = cursor.execute('select count(*) from User where username = %s and password = %s',(un,pw))
    res = cursor.fetchall()
    print("数据库查询结果:" + str(res[0][0]))
    print(type(res[0][0]))
    if res[0][0] > 0:
        return True;
    return False;

@app.route("/login",methods=["POST"])
def login():
    un = request.form['username']
    pw = request.form['password']
    if exist_user(un,pw):
        session['username'] = un;
        return '{"status": "success","log_username": "' + un + '"}'
    else:
        return '{"status": "failed"}'

@app.route('/index',methods=['GET'])
def index():
    if session.get('username',None):
        return '{"status": "success"}'
    else:
        return '{"status": "failed"}'

@app.route('/online',methods=['GET'])
def online():
    un = session.get('username',None)
    if un:
        return '{"status": "success","log_username": "' + un + '"}'
    else:
        return '{"status": "failed"}'

@app.route('/logout',methods=['GET'])
def logout():
    if session.pop('username',None):
        return '{"status": "success"}'
    else:
        return '{"status": "failed"}'

def save_table_to_DB(un,tbl,tbl_n,tbl_c):
    db = DBTools('root','liubixue','GetMyTable')
    conn = db.connect()
    cursor = db.get_cursor()
    try:
        cursor.execute('insert into Data(belongTo,content,name,class) values(%s,%s,%s,%s)',(un,tbl,tbl_n,tbl_c))
        conn.commit()
        return True
    except Exception as e:
        print(e)
        return False



@app.route('/save_table',methods=['POST'])
def save_table():
    print("Save To Table DB")
    print(request.json)
    tbl = request.json['content']
    tbl_n = request.json['table_name']
    tbl_c = request.json['table_class']
    print(tbl)
    print(tbl_n)
    print(tbl_c)
    un = session.get('username',None)
    if un == None:
        return '{"status": "failed"}'
    if save_table_to_DB(un,tbl,tbl_n,tbl_c):
        return '{"status": "success"}'
    else:
        return '{"status": "failed"}'


@app.route('/get_all_class',methods=['GET'])
def get_all_class():
    un = session.get('username',None)
    if un == None:
        return '[]'
    db = DBTools('root','liubixue','GetMyTable')
    db.connect()
    cursor = db.get_cursor()
    res = cursor.execute('select className from Class where belongTo = %s',(un,));
    res = cursor.fetchall()
    classes = []
    for t in res:
        classes.append(t[0])
    print(classes)
    return json.dumps(classes)


@app.route('/add_new_class',methods=['POST'])
def add_new_class():
    print('Session:')
    print(session)
    un = session.get('username',None)
    if un == None:
        print("没有用户名session")
        return '{"status": "failed"}'
    print(request.json)
    new_class_name = request.json['new_class_name']
    print("新分类" + new_class_name)
    db = DBTools('root','liubixue','GetMyTable')
    conn = db.connect()
    cursor = db.get_cursor()
    res = cursor.execute('select count(*) from Class where className = %s and belongTo = %s ',(new_class_name,un))
    res = cursor.fetchall()
    if(res[0][0] > 0):
        return '{"status": "existed"}'
    try:
        cursor.execute('insert into Class(className,belongTo) values(%s,%s)',(new_class_name,un))
        conn.commit()
        return '{"status": "success"}'
    except Exception as e:
        print(e)
        return '{"status": "failed"}'


@app.route('/get_all_table',methods=['GET'])
def get_all_table():
    un = session.get('username',None)
    cn = request.args.get('class_name')
    print(cn)
    if un == None:
        return '[]'
    db = DBTools('root','liubixue','GetMyTable')
    db.connect()
    cursor = db.get_cursor()
    res = cursor.execute('select name,id from Data where belongTo = %s and class = %s',(un,cn))
    res = cursor.fetchall()
    return json.dumps(res)

@app.route('/get_table_by_id',methods=['POST'])
def get_table_by_id():
    un = session.get('username',None)
    if un == None:
        print("用户session不存在!")
        return '{"status": "failed"}'
    try:
        tbl_id = request.json['table_id']
        db = DBTools('root','liubixue','GetMyTable')
        db.connect()
        cursor = db.get_cursor()
        res = cursor.execute('select content from Data where id = %s',(tbl_id,))
        res = cursor.fetchall()
        tbl = {}
        tbl['status'] = 'success'
        tbl['content'] = res[0][0]
        return json.dumps(tbl)
    except Exception as e:
        return '{"status": "failed"}'
    
@app.route('/delete_table_by_id',methods=['POST'])
def delete_table_by_id():
    un = session.get('username',None)
    if un == None:
        print("用户session不存在!")
        return '{"status": "failed"}'
    try:
        tbl_id = request.json['table_id']
        db = DBTools('root','liubixue','GetMyTable')
        conn = db.connect()
        cursor = db.get_cursor()
        res = cursor.execute('delete from Data where belongTo = %s and id = %s',(un,tbl_id))
        conn.commit() 
        cursor.execute('delete from Share where tbl_id = %s',(tbl_id,))
        conn.commit()
        return '{"status": "success"}'
    except Exception as e:
        return '{"status": "failed"}'

@app.route('/delete_class_name',methods=['POST'])
def delete_class_name():
    un = session.get('username',None)
    if un == None:
        print("用户session不存在!")
        return '{"status": "failed"}'
    try:
        cls_name = request.json['class_name']
        db = DBTools('root','liubixue','GetMyTable')
        conn = db.connect()
        cursor = db.get_cursor()
        res = cursor.execute('delete from Share where tbl_id in (select id from Data where belongTo = %s and class = %s)',(un,cls_name))
        conn.commit();
        res = cursor.execute('delete from Data where belongTo = %s and class =  %s',(un,cls_name))
        conn.commit();
        res = cursor.execute('delete from Class where className = %s',(cls_name,))
        conn.commit()
        return '{"status": "success"}'
    except Exception as e:
        print(e)
        return '{"status": "failed"}'


@app.route('/get_info',methods=['GET'])
def get_person_info():
    un = session.get('username',None)
    if un == None:
        print("用户session不存在!")
        return '{"status": "failed"}'
    try:
        db = DBTools('root','liubixue','GetMyTable')
        db.connect()
        cursor = db.get_cursor()
        res = cursor.execute('select username,ava_url,email,person_net,intro from User where username = %s',(un,))
        res = cursor.fetchall()
        info = {}
        info['status'] = 'success'
        info['username'] = res[0][0]
        info['ava_url'] = res[0][1]
        info['email'] = res[0][2]
        info['person_net'] = res[0][3]
        info['intro'] = res[0][4]
        print(info)
        return json.dumps(info)
    except Exception as e:
        print(e)
        return '{"status": "failed"}'


@app.route('/save_info',methods=['POST'])
def save_person_info():
    ava_url = request.json['ava_url']
    person_net = request.json['person_net']
    intro = request.json['intro']
    un = session.get('username',None)
    if un == None:
        return '{"status": "failed"}'
    try:
        db = DBTools('root','liubixue','GetMyTable')
        conn = db.connect()
        cursor = db.get_cursor()
        res = cursor.execute('update User set ava_url = %s,person_net = %s,intro = %s  where username = %s',(ava_url,person_net,intro,un))
        conn.commit()
        return '{"status": "success"}'
    except Exception as e:
        print(e)
        return '{"status": "failed"}'

@app.route('/new_share',methods=['POST'])
def add_new_share():
    tbl_id = request.json['tbl_id']
    time = request.json['time']
    comm = request.json['comment']       
    un = session.get('username',None)
    if un == None:
        return '{"status": "failed"}'
    try:
        db = DBTools('root','liubixue','GetMyTable')
        conn = db.connect()
        cursor = db.get_cursor()
        res = cursor.execute('insert into Share(username,time,tbl_id,comment)  values(%s,%s,%s,%s)',(un,time,tbl_id,comm))
        conn.commit()
        return '{"status": "success"}'
    except Exception as e:
        print(e)
        return '{"status": "failed"}'


@app.route('/get_all_share',methods=['GET'])
def get_all_share():
    un = session.get('username',None)
    if un == None:
        return '{"status": "failed"}'
    try:
        res = {}
        db = DBTools('root','liubixue','GetMyTable')
        conn = db.connect()
        cursor = db.get_cursor()
        cursor.execute('select * from Share order by time desc'); 
        res['content'] = cursor.fetchall()
        res['status'] = 'success'
        return json.dumps(res)
    except Exception as e:
        print(e)
        return '{"status": "failed"}'   

@app.route('/get_table_name',methods=['POST'])
def get_table_name_by_id():
    un = session.get('username',None)
    if un == None:
        print("用户session不存在!")
        return '{"status": "failed"}'
    try:
        tbl_id = request.json['table_id']
        db = DBTools('root','liubixue','GetMyTable')
        db.connect()
        cursor = db.get_cursor()
        res = cursor.execute('select name from Data where id = %s',(tbl_id,))
        res = cursor.fetchall()
        tbl = {}
        tbl['status'] = 'success'
        tbl['name'] = res[0][0]
        return json.dumps(tbl)
    except Exception as e:
        print(e)
        return '{"status": "failed"}'



@app.route('/get_avatar_url',methods=['GET'])
def get_avatar_url_by_name():
    un = session.get('username',None)
    if un == None:
        print("用户session不存在!")
        return '{"status": "failed"}'
    try:
        db = DBTools('root','liubixue','GetMyTable')
        db.connect()
        cursor = db.get_cursor()
        un = request.args.get('username')
        res = cursor.execute('select ava_url from User where username = %s',(un,))
        res = cursor.fetchall()
        tbl = {}
        tbl['status'] = 'success'
        tbl['url'] = res[0][0]
        return json.dumps(tbl)
    except Exception as e:
        print(e)
        return '{"status": "failed"}'



if __name__ == '__main__':
    app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
    app.debug = True
    app.run(host="0.0.0.0")


