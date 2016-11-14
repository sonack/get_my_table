# !/usr/bin/env python3

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

def save_table_to_DB(un,tbl):
    db = DBTools('root','liubixue','GetMyTable')
    conn = db.connect()
    cursor = db.get_cursor()
    try:
        cursor.execute('insert into Data(belongTo,content) values(%s,%s)',(un,tbl))
        conn.commit()
        return True
    except Exception:
        return False



@app.route('/save_table',methods=['POST'])
def save_table():
    print("Save To Table DB")
    print(request.json)
    tbl = request.json['content']
    print(tbl)
    un = session.get('username',None)
    if un == None:
        return '{"status": "failed"}'
    if save_table_to_DB(un,tbl):
        return '{"status": "success"}'
    else:
        return '{"status": "failed"}'



if __name__ == '__main__':
    app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
    app.debug = True
    app.run(host="0.0.0.0")


