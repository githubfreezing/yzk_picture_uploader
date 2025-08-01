from models import Base
from sqlalchemy import create_engine

DATABASE_URL = "postgresql://yzkpuDbMaster:yzk-picture-uploader-Db-Password@database-1.czu8trax56dw.ap-northeast-1.rds.amazonaws.com:5432/yzkpuDbName"
engine = create_engine(DATABASE_URL)

# テーブルを作成
Base.metadata.create_all(bind=engine)