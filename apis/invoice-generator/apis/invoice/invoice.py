from datetime import datetime
from bson.objectid import ObjectId
import settings
from connection import db, ses, aws_sns
from fastapi import (
    APIRouter,
    HTTPException,
    Path,
    Request,
    Form,
    Response,
    File,
    Depends,
    status,
    UploadFile,
)
import os
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
import stripe
import settings

stripe.api_key = settings.stripe_secret_key
# from apis.invoice.crud import crud
# from apis.invoice.models import  NoteSchema
token_auth_scheme = HTTPBearer()  # 👈 new code
router = APIRouter()
# config = pdfkit.configuration(
#     wkhtmltopdf=r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"
# )


@router.get("/", status_code=200)
async def get_invoices(
    userID: str,
    limit: int = 5,
    skip: int = 0,
):
    # note_id = await crud.post(payload)
    response = {}
    invoices = []
    for invoice in db.invoices.find():
        invoice["_id"] = str(invoice["_id"])
        invoices.append(invoice)
    count = db.invoices.find().count()
    response.update({"count": count})
    response.update({"invoices": invoices})
    # print(data)
    # data["_id"] = str(data["_id"])
    response_object = {
        # "id": note_id,
        # "title": data
    }
    return jsonable_encoder(response)


@router.get("/getinvoicebyuserid/{userID}", status_code=200)
async def get_invoics_by_user_id(
    userID: str,
    limit: int = 5,
    skip: int = 0,
):
    # note_id = await crud.post(payload)
    if userID:
        response = {}
        invoices = []
        for invoice in (
            db.invoices.find({"createdByUserID": userID})
            .sort("currentDate", -1)
            .limit(limit)
        ):
            invoice["_id"] = str(invoice["_id"])
            invoices.append(invoice)
        count = db.invoices.find({"createdByuserID": userID}).count()
        response.update({"count": count})
        response.update({"invoices": invoices})
        # print(data)
        # data["_id"] = str(data["_id"])
        response_object = {
            # "id": note_id,
            # "title": data
        }
        return jsonable_encoder(response)


@router.delete("/deleteinvoicebyinvoiceid/{invoiceID}", status_code=200)
async def get_customers(invoiceID: str):
    # note_id = await crud.post(payload)
    users = []
    if invoiceID:
        data = db.invoices.delete_one({"_id": ObjectId(invoiceID)})
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


@router.delete("/", status_code=200)
async def get_invoics_by_user_id():
    # note_id = await crud.post(payload)
    invoices = []
    db.invoices.delete_many({})

    response = {
        "message": "sucess"
        # "id": note_id,
        # "title": data
    }
    return JSONResponse(jsonable_encoder(response))


from bson import json_util


@router.post("/addinvoice/", status_code=201)
async def create_invoice(request: Request):
    invoice = await request.json()
    data = {}
    data["createdDate"] = str(datetime.utcnow())
    data["status"] = True
    data["lastUpdatedDate"] = str(datetime.utcnow())
    data["isEmailSent"] = False
    data["invoiceStatus"] = "Email Sending"
    data["isPaid"] = False
    data["paymentStatus"] = "Pending"
    data.update(invoice)

    response = db.invoices.insert_one(dict(data))
    # print(data)
    if response.acknowledged:
        return {"message": "inserted succesfully", "id": str(response.inserted_id)}
    else:
        raise HTTPException(status_code=404, detail="Error Occured in inserting data")


import shutil


@router.post("/sendinvoice/", status_code=201)
def send_invoice(
    toEmail: str = Form(...),
    invoiceID: str = Form(...),
    fromName: str = Form(...),
    file: UploadFile = File(...),
):
    data = {}
    data["toEmail"] = toEmail
    data["fromName"] = fromName
    data["fromName"] = fromName
    file_location = f"static/{file.filename}"
    response = sendinvoice(file, data)
    print(data)
    if response:
        response = db.invoices.update_one(
            {"_id": ObjectId(invoiceID)},
            {"$set": {"isEmailSent": True, "invoiceStatus": "Sent"}},
        )
        if response.acknowledged and response.modified_count > 0:
            return {"message": file}
        else:
            raise HTTPException(
                status_code=404, detail="Error occured in updating database"
            )
    else:
        response = db.invoices.update_one(
            {"_id": ObjectId(invoiceID)},
            {"$set": {"isEmailSent": False, "emailStatus": "Failed to send email"}},
        )
        raise HTTPException(status_code=404, detail="Failed to send email")


# @router.post("/addinvoice/", status_code=201)
# async def create_invoice(
#     response: Response, user: Invoice, token: str = Depends(token_auth_scheme)
# ):
#     result = VerifyToken(token.credentials).verify()  # 👈 updated code

#     # 👇 new code
#     if result.get("status"):
#         response.status_code = status.HTTP_400_BAD_REQUEST
#         return result

#     print(user)
#     if db.invoices.insert_one(dict(user)):
#         return {"message": "inserted succesfully"}
#     else:
#         raise HTTPException(status_code=404, detail="Error Occured in inserting data")

templates = Jinja2Templates(directory="templates")


def create_multipart_message(
    sender: str,
    recipients: list,
    title: str,
    text: str = None,
    html: str = None,
    attachments: list = None,
    file: UploadFile = None,
) -> MIMEMultipart:
    """
    Creates a MIME multipart message object.
    Uses only the Python `email` standard library.
    Emails, both sender and recipients, can be just the email string or have the format 'The Name <the_email@host.com>'.

    :param sender: The sender.
    :param recipients: List of recipients. Needs to be a list, even if only one recipient.
    :param title: The title of the email.
    :param text: The text version of the email body (optional).
    :param html: The html version of the email body (optional).
    :param attachments: List of files to attach in the email.
    :return: A `MIMEMultipart` to be used to send the email.
    """
    multipart_content_subtype = "alternative" if text and html else "mixed"
    msg = MIMEMultipart(multipart_content_subtype)
    msg["Subject"] = title
    msg["From"] = sender
    msg["To"] = ", ".join(recipients)

    # Record the MIME types of both parts - text/plain and text/html.
    # According to RFC 2046, the last part of a multipart message, in this case the HTML message, is best and preferred.
    if text:
        part = MIMEText(text, "plain")
        msg.attach(part)
    if html:
        part = MIMEText(html, "html")
        msg.attach(part)

    # Add attachments
    # for attachment in attachments or []:
    #     with open(attachment, "rb") as f:
    #         part = MIMEApplication(f.read())
    #         part.add_header(
    #             "Content-Disposition",
    #             "attachment",
    #             filename=os.path.basename(attachment),
    #         )
    #         msg.attach(part)
    part = MIMEApplication(file.file.read())
    part.add_header("Content-Disposition", "attachment", filename="invoice.pdf")
    msg.attach(part)
    return msg


def sendinvoice(request: UploadFile, send):
    print(send)
    sender = "no-reply@billie.digital"
    recipients = [send["toEmail"]]
    title = "Invoice from  " + send["fromName"]
    text = ""
    html = """If you have any questions about this invoice, simply reply to this email or reach out to our support team ( support@billie.digital ) for help."""

    attachments = [f"static/{request.filename}"]
    msg = create_multipart_message(
        sender, recipients, title, text, html, attachments, request
    )

    email = ses.send_raw_email(
        Source=settings.SES_EMAIL_SOURCE,
        Destinations=recipients,
        RawMessage={"Data": msg.as_string()},
    )
    response = aws_sns.publish(
        PhoneNumber="919074134303",
        Message="you have received invoice from santhosh",
        MessageAttributes={
            "SMSType": {"DataType": "String", "StringValue": "Transactional"}
        },
    )
    print(email)
    # ses.send_email(
    #     Source=settings.SES_EMAIL_SOURCE,
    #     Destinations=["santhoshthomas015@gmail.com"],
    #     RawMessage={"Data": msg.as_string()},
    # )
    return email
