from typing import List, Optional
from pydantic.fields import Undefined
from pydantic.main import BaseModel
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

from fastapi.security import HTTPBearer  #
from utils import VerifyToken
import tempfile
from starlette.responses import FileResponse

from email_validator import validate_email, EmailNotValidError
from datetime import datetime
import stripe
import settings

stripe_keys = {
    "secret_key": "sk_test_51IKRfRCCEYhS0ArYnzpJI9ABllYFZRVxSAIqspGzGnmnyigmlWjmTKH2rzopxwTqznCGk0N3KuLO0AWnv7FonnNK00YSUeeBI6",
    "publishable_key": "pk_test_51IKRfRCCEYhS0ArY9aL0a7Ht7ABwAPotjP4K0vrWF2nf1wAR1Qo2LzjlNK6cP0JZ4bC9RGgvHJG9rXUsEUfLlNFp00I5S5dGy8",
    "price_id": "price_1JqtFKCCEYhS0ArYL1BqraY8",
}

stripe.api_key = settings.stripe_secret_key

router = APIRouter()


class CreateCustomer(BaseModel):
    email: str


class CreateSubscription(BaseModel):
    customerID: str
    userID: str
    priceID: str
    paymentMethodId: List[str]


# class paymentMethod(BaseModel):
#     billing_details: Optional[str]
#     size: float = None


@router.post("/createpaymentmethod")
async def create_subscritpions(request: Request):
    request = await request.json()
    print(request["customerID"])
    response1 = stripe.PaymentMethod.attach(
        request["paymentMethodId"]["id"], customer=request["customerID"]
    )
    return {"message": "inserted succesfully"}


@router.post("/createsubscription")
async def create_subscritpions(request: Request):
    request = await request.json()
    print(request)
    try:
        response = stripe.Subscription.create(
            customer=request["customerID"],
            items=[{"price": request["priceID"]}],
            default_payment_method=request["paymentMethodId"],
            expand=["latest_invoice.payment_intent"],
        )
        # response["userID"] = request["userID"]
        # if db.users.update_one(
        #     {"_id": request["userID"]},
        #     {"$set": {"subscriptionID": response["id"]}},
        # ):
        return {"message": "inserted succesfully"}
    except Exception as e:
        raise HTTPException(status_code=404, detail="Error Occured in inserting data")


@router.post("/createcheckoutsession")
async def create_subscritpions(request: Request):
    request = await request.json()
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        customer=request["customerID"],
        line_items=[
            {
                "price": request["priceID"],
                "quantity": 1,
            }
        ],
        mode="subscription",
        success_url=request["websiteURL"]
        + "/dashboard/settings?session_id={CHECKOUT_SESSION_ID}",
        cancel_url=request["websiteURL"] + "/dashboard/settings",
    )
    return session


@router.post("/createportalsession")
async def create_subscritpions(request: Request):
    request = await request.json()
    print(request)
    return_url = request["websiteURL"] + "/dashboard/settings"
    portalSession = stripe.billing_portal.Session.create(
        customer=request["customerID"],
        return_url=return_url,
    )
    return portalSession["url"]


@router.get("/getsubscriptionbyid/{subscriptionID}")
def get_subscritpion(subscriptionID: str):
    try:
        response = stripe.Subscription.retrieve(subscriptionID)
        return response
    except:
        return None


@router.get("/getsubscriptionbyid/{userID}")
def get_subscritpion_by_userID(userID: str):
    response = []
    subscriptions = db.subscriptions.find({"createdByUserID": userID})
    if subscriptions:
        for subscription in subscriptions:
            subscription["_id"] = str(subscription["_id"])
            response.append(subscription)
    return response


@router.get("/getinvoicesbycustomerid/{customerID}")
def get_subscritpion(customerID: str):
    if customerID:
        response = []
        invoices = stripe.Invoice.retrieve(customer=customerID)
        return invoices


@router.post("/createcustomer")
def create_customer(customer: CreateCustomer):
    try:
        response = stripe.Customer.create(email=customer.email)
        if response:
            db.users.update_one(
                {"email": customer.email}, {"$set": {"stripeCustomer": response}}
            )

            return {"message": "inserted succesfully"}
        # return response
    except EmailNotValidError as e:
        #  email is not valid, exception message is human-readable
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/updatecustomer")
async def update_customer(request: Request):
    try:
        event = await request.json()
        customer = event["data"]["object"]
        response = stripe.Customer.modify()
        if response:
            db.users.update_one(
                {"stripeCustomer.id": customer.email},
                {"$set": {"stripeCustomer": response}},
            )

            return {"message": "inserted succesfully"}
        # return response
    except EmailNotValidError as e:
        #  email is not valid, exception message is human-readable
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/listcustomers")
def create_customer():
    response = stripe.Customer.auto_paging_iter()
    return response


@router.get("/listcustomerspayment/{customerID}")
async def create_customer(customerID: str):
    if customerID != Undefined:    
        response = stripe.Customer.list_payment_methods(
            customerID,
            type="card",
        )
        return response["data"]


@router.delete("/deletepaymentmethod/{paymentMethodID}")
async def create_customer(paymentMethodID: str):
    response = stripe.PaymentMethod.detach(paymentMethodID)

    return response


@router.delete("/deletecustomer")
def delete_customer(customerID: str):
    if customerID:
        response = stripe.Customer.delete(customerID)
        return response


@router.get("/listplans")
def list_all_plans(request: Request):

    response = stripe.Plan.auto_paging_iter()
    return response


@router.get("/listsubscriptions")
def list_all_suscriptions():
    response = stripe.Subscription.auto_paging_iter()
    return response


@router.get("/listproducts")
def list_all_products(request: Request):
    response = stripe.Product.auto_paging_iter()
    return response


@router.delete("/deleteproduct/{productID}")
def list_all_products(productID: str):
    response = stripe.Product.delete(productID)
    return response
