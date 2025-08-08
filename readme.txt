■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
http://yzk-picture-uploader-react-bucket.s3-website-ap-northeast-1.amazonaws.com/
http://yzk-picture-uploader-react-bucket.s3-website-ap-northeast-1.amazonaws.com/display-view
■React
# npm を使う場合
npx create-vite@latest frontend -- --template react

■
国　　　　　　　　地域　　　　　　　　メールアドレス => 名前

国内　　　　　　　静岡　　梼原　　　　sample-kokunai1@gmail.com　sample-kokunai2@gmail.com

海外　　　　　　　ハノイ　ホーチミン　sample-kaigai1@gmail.com　sample-kaigai2@gmail.com

イン・ジャパン(優先)　　なし　　　　　　　　sample-injapan1@gmail.com　sample-injapan2@gmail.com

■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

■yzk-picture-uploader-RDS-instance
yzk-picture-uploader-DB-instance-identifier
database-1

■yzkpuDbMaster
■yzk-picture-uploader-Db-Password

yzk-picture-uploader-sg

■yzkpuDbName
postgres

docker exec -it e847566ca984f1222349f19464b36a88f61a9cffb58e96b686ddb5c60be9ea83 python create_tables.py

KMS キー ID
1b67a3e3-f929-46d6-86ac-9810bbf918d8

■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

docker build -t yzk-picture-uploader-ecr .
docker run --rm -it -p 8000:8000 yzk-picture-uploader-ecr

docker tag yzk-picture-uploader-ecr 257307162849.dkr.ecr.ap-northeast-1.amazonaws.com/yzk-picture-uploader-ecr
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 257307162849.dkr.ecr.ap-northeast-1.amazonaws.com
docker push 257307162849.dkr.ecr.ap-northeast-1.amazonaws.com/yzk-picture-uploader-ecr

■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

psql -h database-1.czu8trax56dw.ap-northeast-1.rds.amazonaws.com -U yzkpuDbMaster -d yzkpuDbName



source myenv/bin/activate



■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

scp -i D:/bc_predict_ec2_key_pair.pem D:/yzk_picture_uploader/connectiong_code/create_tables.py ubuntu@52.195.182.252:/home/ubuntu/
scp -i D:/bc_predict_ec2_key_pair.pem D:/yzk_picture_uploader/connectiong_code/models.py ubuntu@52.195.182.252:/home/ubuntu/

DATABASE_URL = "postgresql://yzkpuDbMaster:yzk-picture-uploader-Db-Password@database-1.czu8trax56dw.ap-northeast-1.rds.amazonaws.com:5432/yzkpuDbName"


■
scp -r -i "D:/bc_predict_ec2_key_pair.pem" "D:/yzk_picture_uploader/yzk_picture_uploader/connectiong_code" ubuntu@52.195.182.252:/home/ubuntu/







■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

psql -h database-1.czu8trax56dw.ap-northeast-1.rds.amazonaws.com -U yzkpuDbMaster -d yzkpuDbName -p 5432

■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
apt update && apt install sqlite3
sqlite3 backend/yzkpuDbName.db
.table
INSERT INTO users (name, email) VALUES ('本行 桃果', 'momoka.hongyo@jp.yazaki.com');

■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
yzk-picture-uploader-alb-1829537311.ap-northeast-1.elb.amazonaws.com

apt update && apt install sqlite3 -y

D:\yzk_picture_uploader\yzk_picture_uploader\backend>sqlite3 yzkpuDbName.db

■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

alembic -c alembic_src\alembic.ini revision --autogenerate -m "Add pictures table"

alembic -c alembic_src\alembic.ini upgrade head

■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
































