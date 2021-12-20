from pymongo import MongoClient
import settings
import boto3

print(settings.Mode)
print(settings.mongodb_uri)
client = MongoClient(settings.mongodb_uri)
if settings.Mode == "PRODUCTION":
    db = client["Billie"]
elif settings.Mode == "STAGING":
    db = client["billie"]
else:
    db = client["billie"]


# s3_client = boto3.client("s3")
# s3_resource = boto3.resource("s3")

ses = boto3.client(
    "ses",
    region_name=settings.AWS_REGION_NAME,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)

aws_sns = boto3.client(
    "sns",
    region_name=settings.AWS_REGION_NAME,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)
