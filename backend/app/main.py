from fastapi import FastAPI, HTTPException, File, UploadFile, Form, Depends, APIRouter
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv
import boto3
import psycopg2
from psycopg2 import OperationalError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import SQLAlchemyError
from .models.models import User, Base, UserCourse, Course, CourseCountry, Country, Picture

from collections import defaultdict

#ダウンロード機能
import io
import zipfile
from fastapi.responses import StreamingResponse
from urllib.parse import quote  # URLエンコード用

from jose import jwt
from datetime import datetime, timedelta
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

def create_jwt_token(data: dict, expires_delta: timedelta = timedelta(minutes=30)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = os.getenv("AWS_STORAGE_BUCKET_NAME")
AWS_S3_REGION_NAME = os.getenv("AWS_S3_REGION_NAME")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_S3_REGION_NAME  # 例：東京リージョン
)

# FastAPIアプリケーションのインスタンスを作成
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydanticモデルでリクエストボディの構造を定義
class LoginRequest(BaseModel):
    email: str

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"#####DATABASE_URL#####:{DATABASE_URL}")

# DB接続設定
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# DBセッション依存性
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ルートエンドポイント
@app.get("/")
async def read_root(db: Session = Depends(get_db)):
    try:
        users = db.query(User).all()
        users_data = [{"id": u.id, "name": u.name, "email": u.email} for u in users]
        return {"message": users_data}
    except SQLAlchemyError as e:
        # ログ出力したければここで e を print/log できます
        return JSONResponse(
            status_code=500,
            content={"message": "データベースに接続できませんでした。"}
        )

@app.post("/login")
async def login(request: LoginRequest):
    email = request.email
    print(f"受信したemail（POST）: {email}")

    # データベース接続
    session = SessionLocal()

    try:
        # emailが存在するか確認
        user = session.query(User).filter(User.email == email).first()

        if user:
            message = f"ログイン成功!!!: {email}"
            # return {"message": message}
            token = create_jwt_token({"sub": email})
            return {"token": token, "message": "ログイン成功"}
        else:
            message = f"ログイン失敗: {email} は登録されていません"
            raise HTTPException(status_code=401, detail=message)
    finally:
        session.close()

# @app.post("/upload")
# async def upload_files(
#     files: List[UploadFile] = File(...),
#     country: str = Form(...),
#     region: str = Form(""),
#     name: str = Form(...)
# ):
#     uploaded_files = []

#     for file in files:
#         content = await file.read()
#         print(f"受信ファイル: {file.filename}, サイズ: {len(content)} bytes")

#         # S3 パス作成：国/コース/氏名/ファイル名
#         # コースが空文字なら除外
#         s3_key_parts = [country]
#         if region:
#             s3_key_parts.append(region)
#         s3_key_parts.append(name)
#         s3_key = "/".join(s3_key_parts) + f"/{file.filename}"

#         try:
#             s3_client.put_object(
#                 Bucket=AWS_STORAGE_BUCKET_NAME,
#                 Key=s3_key,
#                 Body=content,
#                 ContentType=file.content_type or "application/octet-stream",
#             )
#             print(f"→ S3にアップロード済み: s3://{AWS_STORAGE_BUCKET_NAME}/{s3_key}")
#             uploaded_files.append(s3_key)
#         except Exception as e:
#             print(f"S3アップロード失敗: {file.filename} → {e}")

#     print(f"選択された国: {country}")
#     print(f"選択されたコース: {region}")
#     print(f"選択された氏名: {name}")

#     return {
#         "message": f"{len(uploaded_files)} 件のファイルを S3 に保存しました",
#         "uploaded_files": uploaded_files,
#     }

@app.post("/upload")
async def upload_files(
    files: List[UploadFile] = File(...),
    country: str = Form(...),
    # region: str = Form(""),
    region: str = Form(...),
    name: str = Form(...)
):
    uploaded_files = []
    db: Session = SessionLocal()

    try:
        # ユーザー特定（必要に応じてフィルタを追加）
        user = db.query(User).filter(User.name == name).first()
        if not user:
            return {"error": f"ユーザー '{name}' が見つかりません"}

        # course_id 変換
        print("##############region##############")
        print(region)
        course = db.query(Course).filter(Course.course_name == region).first()
        course_id = course.id if course else None

        for file in files:
            content = await file.read()
            print(f"受信ファイル: {file.filename}, サイズ: {len(content)} bytes")

            # S3 キー作成
            s3_key_parts = [country]
            if region:
                s3_key_parts.append(region)
            s3_key_parts.append(name)
            s3_key = "/".join(s3_key_parts) + f"/{file.filename}"

            try:
                # S3にアップロード
                s3_client.put_object(
                    Bucket=AWS_STORAGE_BUCKET_NAME,
                    Key=s3_key,
                    Body=content,
                    ContentType=file.content_type or "application/octet-stream",
                )
                print(f"→ S3にアップロード済み: s3://{AWS_STORAGE_BUCKET_NAME}/{s3_key}")
                uploaded_files.append(s3_key)

                # RDSのpicturesに保存
                picture = Picture(
                    user_id=user.id,
                    course_id=course_id,
                    url=s3_key,  # または file_path
                    uploaded_at=datetime.utcnow()
                )
                db.add(picture)

            except Exception as e:
                print(f"S3アップロード失敗: {file.filename} → {e}")

        db.commit()

        return {
            "message": f"{len(uploaded_files)} 件のファイルを S3 に保存し、DB に登録しました",
            "uploaded_files": uploaded_files,
        }

    except Exception as e:
        db.rollback()
        return {"error": str(e)}

    finally:
        db.close()

class DisplayRequest(BaseModel):
    country: str
    region: str
    name: str

class FileListResponse(BaseModel):
    message: str
    files: List[str]

# S3ファイル一覧と署名付きURL返却
@app.post("/display", response_model=FileListResponse)
async def display_data(req: DisplayRequest):
    s3_key_parts = [req.country]
    if req.region:
        s3_key_parts.append(req.region)
    s3_key_parts.append(req.name)
    prefix = "/".join(s3_key_parts) + "/"

    print(f"S3パス: s3://{AWS_STORAGE_BUCKET_NAME}/{prefix}")

    s3 = boto3.client("s3")

    try:
        response = s3.list_objects_v2(Bucket=AWS_STORAGE_BUCKET_NAME, Prefix=prefix)
        contents = response.get("Contents", [])

        # ファイル名を除くルートプレフィックスは除外
        urls = []
        for obj in contents:
            key = obj["Key"]
            if key == prefix or key.endswith("/"):
                continue  # ディレクトリ参照はスキップ

            presigned_url = s3.generate_presigned_url(
                'get_object',
                Params={'Bucket': AWS_STORAGE_BUCKET_NAME, 'Key': key},
                ExpiresIn=3600  # 署名URLの有効期限（1時間）
            )
            urls.append(presigned_url)

        return {
            "message": f"{len(urls)} 件の画像URLを取得しました",
            "files": urls
        }

    except Exception as e:
        print("S3一覧取得エラー:", e)
        return {
            "message": "ファイル取得に失敗しました",
            "files": []
        }

@app.get("/users-list")
def get_users_list(db: Session = Depends(get_db)):
    query = (
        db.query(
            User.name.label("user_name"),
            Country.country_name,
            Course.course_name,
        )
        .join(UserCourse, User.id == UserCourse.user_id)
        .join(Course, UserCourse.course_id == Course.id)
        .join(CourseCountry, Course.id == CourseCountry.course_id)
        .join(Country, CourseCountry.country_id == Country.id)
        .all()
    )

    result = defaultdict(lambda: {"regions": defaultdict(list)})

    for row in query:
        result[row.country_name]["regions"][row.course_name].append(row.user_name)

    return {country: {
        "regions": dict(data["regions"]),
        **({"names": data.get("names")} if "names" in data else {})
    } for country, data in result.items()}

class DisplayZipRequest(BaseModel):
    country: str
    region: str = ""
    name: str
    filenames: List[str]  # 選択されたファイル名のリスト

@app.post("/download-zip")
async def download_zip(req: DisplayZipRequest):
    s3 = boto3.client("s3")
    s3_key_parts = [req.country]
    if req.region:
        s3_key_parts.append(req.region)
    s3_key_parts.append(req.name)
    prefix = "/".join(s3_key_parts) + "/"

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w") as zip_file:
        for filename in req.filenames:
            key = prefix + filename  # ファイル名を指定して取得
            file_obj = s3.get_object(Bucket=AWS_STORAGE_BUCKET_NAME, Key=key)
            file_data = file_obj['Body'].read()
            zip_file.writestr(filename, file_data)

    zip_buffer.seek(0)

    encoded_filename = quote(f"{req.name}_selected_images.zip")

    return StreamingResponse(
        zip_buffer,
        media_type="application/x-zip-compressed",
        headers={
            "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}"
        }
    )
