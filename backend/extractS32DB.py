import boto3
import sqlite3
import re
from datetime import datetime

buckets = [
    "yzk-picture-uploader-backup-bucket"
]

region = "ap-northeast-1"  # 東京リージョンなど適宜修正
sqlite_path = "./backend/yzkpuDbName.db"  # SQLiteファイルのパス

# DBコネクション
conn = sqlite3.connect(sqlite_path)
cursor = conn.cursor()

s3 = boto3.client('s3', region_name=region)

for bucket in buckets:
    response = s3.list_objects_v2(Bucket=bucket)
    objects = response.get("Contents", [])

    for obj in objects:
        key = obj["Key"]
        parts = key.strip('/').split('/')

        # 例1: 国内/梼原/酒井 燈/pic.jpg → parts = ['国内', '梼原', '酒井 燈', 'pic.jpg']
        # 例2: イン・ジャパン/吉本 弘/pic.jpg → parts = ['イン・ジャパン', '吉本 弘', 'pic.jpg']
        if len(parts) < 3:
            continue  # 無効な構造

        # if "イン・ジャパン" in parts[0]:
        #     course_name = "なし"
        #     print(f"#####course_name#####:{course_name}")
        #     user_name = parts[1]
        #     print(f"#####user_name#####:{user_name}")
        # else:
        #     course_name = parts[1]
        #     print(f"#####course_name#####:{course_name}")
        #     user_name = parts[2]
        #     print(f"#####user_name#####:{user_name}")

        course_name = parts[1]
        print(f"#####course_name#####:{course_name}")
        user_name = parts[2]
        print(f"#####user_name#####:{user_name}")

        ############################################################################################

        url = f"https://{bucket}.s3.{region}.amazonaws.com/{key}"
        print(f"#####url#####:{url}")
        uploaded_at = obj["LastModified"].isoformat()
        print(f"#####uploaded_at#####:{uploaded_at}")

        # user_id 取得
        cursor.execute("SELECT id FROM users WHERE name = ?", (user_name,))
        user = cursor.fetchone()
        if not user:
            print(f"⚠️ ユーザーが存在しません: {user_name}")
            continue
        user_id = user[0]

        # course_id 取得（"なし"も含めてcoursesテーブルに存在している前提）
        cursor.execute("SELECT id FROM courses WHERE course_name = ?", (course_name,))
        course = cursor.fetchone()
        if not course:
            print(f"⚠️ コースが存在しません: {course_name}")
            continue
        course_id = course[0]

        # INSERT（重複チェックあり）
        cursor.execute("""
            INSERT OR IGNORE INTO pictures (user_id, course_id, url, uploaded_at)
            VALUES (?, ?, ?, ?)
        """, (user_id, course_id, url, uploaded_at))

conn.commit()
conn.close()
print("✅ 完了しました。")