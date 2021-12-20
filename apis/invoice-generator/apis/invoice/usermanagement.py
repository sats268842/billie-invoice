from typing import Optional
import settings
from connection import db, ses, aws_sns
from fastapi import APIRouter, HTTPException, Path, Request, Response, Depends, status
from .models import Customer, Invoice
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
import json
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from fastapi.templating import Jinja2Templates
import stripe
from fastapi.security import HTTPBearer  #
from utils import VerifyToken
import tempfile
from starlette.responses import FileResponse

from email_validator import validate_email, EmailNotValidError
from datetime import datetime
from slack_sdk.webhook import WebhookClient
url = "https://hooks.slack.com/services/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"
webhook = WebhookClient(url)
# from apis.invoice.crud import crud
# from apis.invoice.models import  NoteSchema
token_auth_scheme = HTTPBearer()  # 👈 new code
router = APIRouter()
# config = pdfkit.configuration(
#     wkhtmltopdf=r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"
stripe.api_key = settings.stripe_secret_key
# stripe.

@router.get("/", status_code=200)
async def get_customers():
    # note_id = await crud.post(payload)
    users = []
    for user in db.users.find({}):
        user["_id"] = str(user["_id"])
        users.append(user)

    # print(data)
    # data["_id"] = str(data["_id"])
    response_object = {
        # "id": note_id,
        # "title": data
    }
    return JSONResponse(jsonable_encoder(users))


@router.post("/adduser/", status_code=201)
async def create_user(request: Request):

    print(await request.json())
    user = await request.json()
    data = {}
    data.update(user["user"])
    data["createdDate"] = datetime.utcnow()
    data["status"] = True
    data["roleID"] = "617e7c8a760c0326d91a85c8"
    data["lastUpdatedDate"] = datetime.utcnow()
    data["lastUpdatedDate"] = datetime.utcnow()
    # data["subscriptionID"] = ""
    try:
        response_user = db.users.insert_one(dict(data))
        webhook.send(text="User-Signup")
        webhook.send(text=data["given_name"])
        webhook.send(text=data["email"])
        if response_user.acknowledged and response_user.inserted_id:
            name = data["given_name"] + " " + data["family_name"]
            # stripe_response = add_stripe_customer(, name)
            print("Stripe Key: ", settings.stripe_secret_key)
            stripe_customer = stripe.Customer.create(email=data["email"], name=name)
            print(stripe_customer)
            # response = aws_sns.publish(
            #     PhoneNumber="+919074134303",
            #     Message="New user Logged In",
            #     MessageAttributes={
            #         "SMSType": {"DataType": "String", "StringValue": "Transactional"}
            #     },
            # )
            # if stripe_response:
            return {"message": "inserted succesfully"}
            # else:
            # return {"message": "Error Occured"}
        else:
            raise HTTPException(
                status_code=404, detail="Error Occured in inserting data"
            )
    except EmailNotValidError as e:
        #  email is not valid, exception message is human-readable
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/getuser/{email}", status_code=200)
async def get_user(email):
    try:
        user_details = db.users.find_one({"email": email})
        if user_details:
            user_details["_id"] = str(user_details["_id"])
            return user_details

    except EmailNotValidError as e:
        #  email is not valid, exception message is human-readable
        raise HTTPException(status_code=404, detail=str(e))


def add_stripe_customer(email: str, name: str):

    # stripe_response = 
    # response = db.users.update_one(
    #     {"email": email}, {"$set": {"stripeCustomer": stripe_response}}
    # )
    return True
    # if response.acknowledged and response.modified_count > 1:
    #     return True
    # else:
    #     return False
