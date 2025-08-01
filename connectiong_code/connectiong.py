# import psycopg2

# conn = psycopg2.connect(
#     host="yzk-picture-uploader-db-instance-identifier.czu8trax56dw.ap-northeast-1.rds.amazonaws.com",
#     port=5432,
#     dbname="postgres",
#     user="yzkpuDbMaster",
#     password="yzk-picture-uploader-Db-Password"
# )

# print("接続成功！")

##############################################################################################

import psycopg2
import traceback

# AWS RDS connection details
db_config = {
    "dbname": "yzkpuDbName",
    "user": "yzkpuDbMaster",
    "password": "yzk-picture-uploader-Db-Password",
    "host": "yzk-picture-uploader-rds-instance.czu8trax56dw.ap-northeast-1.rds.amazonaws.com",
    "port": "5432"
}

conn = None
cursor = None

try:
    conn = psycopg2.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute("SELECT version();")
    db_version = cursor.fetchone()
    print(f"接続成功！PostgreSQLのバージョン: {db_version[0]}")

except psycopg2.Error as e:
    print("接続エラーが発生しました。")
    print("エラー内容:", e)
    traceback.print_exc()  # 詳細なエラーを表示する

finally:
    if cursor:
        cursor.close()
    if conn:
        conn.close()

##############################################################################################

# import psycopg2

# # AWS RDS connection details
# db_config = {
#     "dbname": "yzkpuDbName",
#     "user": "yzkpuDbMaster",
#     "password": "yzk-picture-uploader-Db-Password",
#     "host": "yzk-picture-uploader-db-instance-identifier.czu8trax56dw.ap-northeast-1.rds.amazonaws.com",
#     "port": "5432"
# }

# # conn と cursor を初期化
# conn = None
# cursor = None

# try:
#     conn = psycopg2.connect(**db_config)
#     cursor = conn.cursor()
#     cursor.execute("SELECT version();")  # クエリでDB接続を確認
#     db_version = cursor.fetchone()
#     print(f"接続成功！PostgreSQLのバージョン: {db_version[0]}")

# except psycopg2.Error as e:
#     print("接続エラーが発生しました。")
#     print(e)

# finally:
#     if cursor:
#         cursor.close()
#     if conn:
#         conn.close()