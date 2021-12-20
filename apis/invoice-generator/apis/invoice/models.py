import datetime
from typing import Optional
from bson.objectid import ObjectId
from pydantic import BaseModel, Field
from datetime import datetime, date


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class From(BaseModel):
    name: str
    address: str
    country: str
    logo: Optional[str] = None
    phoneNumber: Optional[str] = None
    state: Optional[str] = None
    email: str


class To(BaseModel):
    name: str
    address: str
    country: str
    logo: Optional[str] = None
    phoneNumber: Optional[str] = None
    state: Optional[str] = None
    email: str


class Services(BaseModel):
    id: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None
    quantity: Optional[str] = None
    service: Optional[str] = None


class Invoice(BaseModel):
    fromDetails: Optional[From] = None
    toDetails: Optional[To] = None
    services: Optional[Services] = [{}]
    currency: str
    dueDate: str
    discount: int
    total: int
    currentDate: str
    createdDate: date = datetime.utcnow()
    userID: str
    status: bool = True


class Customer(BaseModel):
    # id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    email: str
    customerType: str
    contactNo: str
    createdDate: date = datetime.utcnow()
    userID: Optional[str] = None
    taxType: Optional[str] = None
    taxID: Optional[str] = None
    status: bool = True


# class NoteDB(NoteSchema):
#     id: int
