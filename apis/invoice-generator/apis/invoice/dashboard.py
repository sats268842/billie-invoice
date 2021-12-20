import time
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
from bson.json_util import dumps
from bson.json_util import loads
from email_validator import validate_email, EmailNotValidError
from datetime import datetime

# from apis.invoice.crud import crud
# from apis.invoice.models import  NoteSchema
token_auth_scheme = HTTPBearer()  # 👈 new code
router = APIRouter()
# config = pdfkit.configuration(
#     wkhtmltopdf=r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"


@router.get("/getdashboardbyuserid/{userID}", status_code=200)
async def get_dashboard(userID: str):
    # note_id = await crud.post(payload)
    dashboard = {}
    if userID != None:

        dashboard["customerCount"] = db.customers.find(
            {"createdByUserID": userID}
        ).count()
        dashboard["invoiceCount"] = db.invoices.find(
            {"createdByUserID": userID}
        ).count()
        data = dumps(
            db.invoices.aggregate(
                [
                    {"$match": {"userID": userID}},
                    {
                        "$group": {
                            "_id": "",
                            "total": {"$sum": "$total"},
                        },
                    },
                ]
            )
        )
        print(loads(data))
        dashboard["lastUpdatedDate"] = time.time()
        total = loads(data)
        if total != []:
            dashboard["invoiceTotal"] = loads(data)[0]["total"]
        else:
            dashboard["invoiceTotal"] = 0
    else:
        dashboard["error"] = "pass userid"
    return dashboard
