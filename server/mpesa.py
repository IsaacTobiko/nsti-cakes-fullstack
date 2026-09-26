import os
import base64
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

CONSUMER_KEY = os.getenv("MPESA_CONSUMER_KEY")
CONSUMER_SECRET = os.getenv("MPESA_CONSUMER_SECRET")
SHORTCODE = os.getenv("MPESA_SHORTCODE")
PASSKEY = os.getenv("MPESA_PASSKEY")
CALLBACK_URL = os.getenv("MPESA_CALLBACK_URL")

AUTH_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
STK_PUSH_URL = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

def get_access_token():
    response = requests.get(AUTH_URL, auth=(CONSUMER_KEY, CONSUMER_SECRET))
    response.raise_for_status()
    return response.json()["access_token"]

def generate_password():
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    data_to_encode = SHORTCODE + PASSKEY + timestamp
    password = base64.b64encode(data_to_encode.encode()).decode()
    return password, timestamp

def stk_push(phone_number, amount, order_code):
    access_token = get_access_token()
    password, timestamp = generate_password()

    headers = {"Authorization": f"Bearer {access_token}"}
    payload = {
        "BusinessShortCode": SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone_number,
        "PartyB": SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": CALLBACK_URL,
        "AccountReference": order_code,
        "TransactionDesc": "NSTI Cakes Order Payment",
    }

    response = requests.post(STK_PUSH_URL, json=payload, headers=headers)
    return response.json()