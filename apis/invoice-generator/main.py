from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from apis.invoice import (
    invoice,
    customers,
    usermanagement,
    dashboard,
    subscription,
    webhook,
)
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import settings

from slack_sdk.webhook import WebhookClient
url = "https://hooks.slack.com/services/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"
webhook = WebhookClient(url)

app = FastAPI()
origins = ["http://localhost:4200", "*"]
app.add_middleware(
    CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"]
)


@app.get("/")
async def health():
    return {"status": "OK"}


@app.get("/config-details")
async def config_details():
    return {"status": "OK", "Mode": settings.Mode,"stripeKey": settings.stripe_secret_key}


app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(invoice.router, prefix="/invoice", tags=["Invoice"])
app.include_router(customers.router, prefix="/customers", tags=["Customers"])
app.include_router(
    usermanagement.router, prefix="/usermanagement", tags=["User Management"]
)
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(subscription.router, prefix="/subscription", tags=["Subscription"])
# app.include_router(webhook.router, prefix="/webhook", tags=["Web hook"])
Mode = settings.Mode
response = webhook.send(text="Fast Api Started to work in " + Mode )
response1 = webhook.send(text="Health OK")

if __name__ == "__main__":
    Mode = settings.Mode
    if Mode == 'PRODUCTION':
        response = webhook.send(text="Fast Api Started to work in " + Mode )
        response1 = webhook.send(text="Health OK")

    if Mode == 'STAGING':
        response = webhook.send(text="Fast Api Started to work in " + Mode )
        response1 = webhook.send(text="Health OK")