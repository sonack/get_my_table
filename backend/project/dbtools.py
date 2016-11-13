# !/usr/bin/env python3

import mysql.connector
class DBTools(object):
    def __init__(self,db_username,db_password,db_database):
        self.db_username = db_username
        self.db_password = db_password
        self.db_database = db_database

    def connect(self):
        try:
            self.conn = mysql.connector.connect(user = self.db_username, password = self.db_password, database = self.db_database)
            return self.conn
        except Exception as e:
            print('数据库连接出错!')

    def get_cursor(self):
        self.cursor = self.conn.cursor()
        return self.cursor

    def close(self):
        self.conn.close()




