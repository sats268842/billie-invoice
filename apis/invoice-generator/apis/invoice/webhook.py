from typing import List, Optional
from fastapi.param_functions import Header
from pydantic.main import BaseModel
import settings
from connection import db, ses
from fastapi import (
    APIRouter,
    HTTPException,
    Path,
    Request,
    Response,
    Depends,
    exceptions,
    status,
)
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

stripe_keys = {
    "secret_key": "sk_test_51IKRfRCCEYhS0ArYnzpJI9ABllYFZRVxSAIqspGzGnmnyigmlWjmTKH2rzopxwTqznCGk0N3KuLO0AWnv7FonnNK00YSUeeBI6",
    "publishable_key": "pk_test_51IKRfRCCEYhS0ArY9aL0a7Ht7ABwAPotjP4K0vrWF2nf1wAR1Qo2LzjlNK6cP0JZ4bC9RGgvHJG9rXUsEUfLlNFp00I5S5dGy8",
    "price_id": "price_1JqtFKCCEYhS0ArYL1BqraY8",
}

stripe.api_key = settings.stripe_secret_key

router = APIRouter()
webhook_secret = "whsec_khqIu1kEsAuWoDXciYIYMzE8zjgGUnX8"


@router.post("/")
async def webhook(request: Request, stripe_signature: str = Header(str)):
    event = None
    request_data = await request.body()
    sig_header = request.headers.get("Stripe-Signature")
    print(request_data)
    if not sig_header:
        raise HTTPException(400, "Missing webhook signature")

    if webhook_secret:
        # Retrieve the event by verifying the signature using the raw body and secret if webhook signing is configured.

        try:
            event = stripe.Webhook.construct_event(
                payload=request_data,
                sig_header=stripe_signature,
                secret=webhook_secret,
            )

        except Exception as e:
            print(e)
            error = str(e)
            raise HTTPException(400, error)
        # Get the type of webhook event sent - used to check the status of PaymentIntents.
    try:

        event_type = event["type"]
        # data_object = data["object"]
        print(event_type)
        if event_type == "checkout.session.completed":
            print("🔔 Payment succeeded!")
        elif event_type == "customer.subscription.trial_will_end":
            print("Subscription trial will end")
        elif event_type == "customer.subscription.created":
            if db.subscriptions.insert_one(jsonable_encoder(event["data"]["object"])):
                return {"message": "inserted succesfully"}
            else:
                raise HTTPException(
                    status_code=404, detail="Error Occured in inserting data"
                )
            print("Subscription created %s", event.id)
        elif event_type == "customer.subscription.updated":
            print("Subscription created %s", event.id)
        elif event_type == "customer.subscription.deleted":
            # handle subscription cancelled automatically based
            # upon your subscription settings. Or if the user cancels it.
            print("Subscription canceled: %s", event.id)

        return {"success": True}

    except exceptions as e:
        raise HTTPException(status_code=404, detail=e)
