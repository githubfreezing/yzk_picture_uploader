from app.models.db_models import Base
from app.db.connection import engine

# テーブル作成
Base.metadata.create_all(engine)