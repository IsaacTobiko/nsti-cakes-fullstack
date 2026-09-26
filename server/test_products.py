from unittest.mock import patch
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def get_token():
    response = client.post(
        "/login",
        data={
            "username": "tobikoisaack@gmail.com",
            "password": "REPLACE_WITH_REAL_PASSWORD",
        },
    )
    return response.json()["access_token"]


@patch("mpesa.stk_push")
def test_initiate_payment_success(mock_stk_push):
    mock_stk_push.return_value = {
        "MerchantRequestID": "test-merchant-id",
        "CheckoutRequestID": "test-checkout-id",
        "ResponseCode": "0",
        "ResponseDescription": "Success",
        "CustomerMessage": "Success",
    }

    token = get_token()
    response = client.post(
        "/mpesa/pay",
        params={
            "order_code": "ORD-1790278850298-2",
            "phone_number": "254708374149",
            "amount": 1,
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["message"] == "STK push sent. Check your phone."


def test_initiate_payment_order_not_found():
    token = get_token()
    response = client.post(
        "/mpesa/pay",
        params={
            "order_code": "ORD-DOES-NOT-EXIST",
            "phone_number": "254708374149",
            "amount": 1,
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 404