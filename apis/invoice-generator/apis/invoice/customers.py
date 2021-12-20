from fastapi import responses
import settings
from connection import db, ses
from fastapi import APIRouter, HTTPException, Path, Request, Response, Depends, status
from .models import Customer, Invoice
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
import json
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from fastapi.templating import Jinja2Templates
from bson.objectid import ObjectId
from fastapi.security import HTTPBearer  #
from utils import VerifyToken
import tempfile
from starlette.responses import FileResponse

from email_validator import validate_email, EmailNotValidError
from datetime import datetime
import stripe

# from apis.invoice.crud import crud
# from apis.invoice.models import  NoteSchema
token_auth_scheme = HTTPBearer()  # 👈 new code
router = APIRouter()
# config = pdfkit.configuration(
#     wkhtmltopdf=r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"


@router.get("/", status_code=200)
async def get_customers():
    # note_id = await crud.post(payload)
    users = []
    for user in db.customers.find({}):
        user["_id"] = str(user["_id"])
        users.append(user)
    return JSONResponse(jsonable_encoder(users))


@router.get("/getcustomersbyuserid/{userID}", status_code=200)
async def get_customers(
    userID: str,
    limit: int = 5,
    skip: int = 0,
):
    # note_id = await crud.post(payload)
    users = []
    for user in db.customers.find({"createdByUserID": userID}).limit(limit):
        user["_id"] = str(user["_id"])
        users.append(user)
    return JSONResponse(jsonable_encoder(users))


@router.get("/getinvoicesbycustomerid/{customerID}", status_code=200)
async def get_customers(
    customerID: str,
    limit: int = 5,
    skip: int = 0,
):
    # note_id = await crud.post(payload)
    invoices = []
    for invoice in db.invoices.find({"to.customerID": customerID}).sort("createdDate", -1).limit(limit):
        invoice["_id"] = str(invoice["_id"])
        invoices.append(invoice)
    return JSONResponse(jsonable_encoder(invoices))

@router.delete("/deletecustomersbycustomerid/{customID}", status_code=200)
async def get_customers(customID: str):
    # note_id = await crud.post(payload)
    users = []
    if customID:
        data = db.customers.delete_one({"_id": ObjectId(customID)})
        print(data.acknowledged)
        print(data.deleted_count)
        if data.acknowledged and data.deleted_count > 0:
            response = "Deleted Successully"
        else:
            response = "Delete Failed"
            raise HTTPException(status_code=404, detail=str(response))
    else:
        response = "Delete Failed"
        raise HTTPException(status_code=404, detail=str(response))
    return JSONResponse(jsonable_encoder(response))


@router.post("/addcustomer/", status_code=201)
async def create_note(request: Request):

    # print(data)
    try:
        customer = await request.json()
        data = {}

        data.update(customer)

        # stripe_response = db.users.update_one(
        #     {
        #         "email": customer["email"],
        #         "createdByUserID": customer["createdByUserID"],
        #     },
        #     {"$set": {"stripeCustomer": stripe_response}},
        # )

        data["createdDate"] = datetime.utcnow()
        data["status"] = True
        data["lastUpdatedDate"] = datetime.utcnow()
        customer_exist = db.customers.find_one(
            {"email": customer["email"], "createdByUserID": customer["createdByUserID"]}
        )
        if not customer_exist:
            response_data = db.customers.insert_one(dict(data))
            if response_data.acknowledged:
                created_customer = db.customers.find_one(
                    {"_id": response_data.inserted_id}
                )
                created_customer["_id"] = str(created_customer["_id"])
                response = {}
                response["message"] = "inserted succesfully"
                response["_id"] = str(response_data.inserted_id)
                response["customer"] = created_customer
                return response
            else:
                raise HTTPException(
                    status_code=404, detail="Error Occured in inserting data"
                )
        else:
            raise HTTPException(status_code=404, detail="Customer Already Exists")
    except EmailNotValidError as e:
        #  email is not valid, exception message is human-readable
        raise HTTPException(status_code=404, detail=str(e))
