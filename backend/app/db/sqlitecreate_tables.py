from app.models.models import Base
from sqlalchemy import create_engine

# SQLite 用の接続文字列（カレントディレクトリに test.db を作成）
DATABASE_URL = "sqlite:///./yzkpuDbName.db"

# SQLite はスレッド制約があるため、connect_args が必要
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# テーブルを作成
Base.metadata.create_all(bind=engine)