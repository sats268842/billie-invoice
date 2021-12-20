# MongoDB attributes
import os
from dotenv import load_dotenv

print(os.environ.get("mongodb_uri"))
if os.environ.get("MODE") == "PRODUCTION":
    load_dotenv(".env-prod")
    mongodb_uri = os.environ.get("mongodb_uri")
    port = 8000
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
    AWS_REGION_NAME = "ap-south-1"
    SES_EMAIL_SOURCE = "noreply@billie.digital"
    stripe_secret_key = os.environ.get("stripe_secret_key")
    stripe_public_key = os.environ.get("stripe_publishable_key")
    STRIPE_LIVE_MODE = os.environ.get("STRIPE_LIVE_MODE")
    Mode = os.environ.get("Mode")

elif os.environ.get("MODE") == "STAGING":
    load_dotenv(".env-staging")
    mongodb_uri = os.environ.get("mongodb_uri")
    port = 8000
    stripe_public_key = os.environ.get("stripe_publishable_key")
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
    AWS_REGION_NAME = "ap-south-1"
    SES_EMAIL_SOURCE = "noreply@billie.digital"
    stripe_secret_key = os.environ.get("stripe_secret_key")
    STRIPE_LIVE_MODE = os.environ.get("STRIPE_LIVE_MODE")
    Mode = os.environ.get("Mode")
else:
    print(os.environ.get(".env-development"))
    load_dotenv(".env-development")
    mongodb_uri = os.environ.get("mongodb_uri")
    port = 8000
    stripe_public_key = os.environ.get("stripe_publishable_key")
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
    AWS_REGION_NAME = "ap-south-1"
    SES_EMAIL_SOURCE = "noreply@billie.digital"
    stripe_secret_key = os.environ.get("stripe_secret_key")
    Mode = os.environ.get("Mode")
    STRIPE_LIVE_MODE = os.environ.get("STRIPE_LIVE_MODE")