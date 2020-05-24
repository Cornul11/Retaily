from flask import json

from app import app


def test_product_info():
    test_product_plu()

    test_product_name()

    test_product_inexistent_plu()


def test_product_inexistent_plu():
    # testing based on inexistent PLU
    product_plu = -1234
    response = app.test_client().get(
        '/product?plu=' + str(product_plu),
        follow_redirects=True
    )

    data = json.loads(response.get_data(as_text=True))

    assert response.status_code == 404
    assert 'niet gevonden' in data['message']


def test_product_name():
    # testing based on name
    product_name = 'BROOD NS'
    response = app.test_client().get(
        '/product?name=' + str(product_name),
        follow_redirects=True
    )

    data = json.loads(response.get_data(as_text=True))

    assert response.status_code == 200
    assert len(data) == 4
    assert data['name'] == 'BROOD NS'
    assert data['plu'] == 10070
    assert data['selling_price'] is not None


def test_product_plu():
    # testing based on plu
    product_plu = 10070
    response = app.test_client().get(
        '/product?plu=' + str(product_plu),
        follow_redirects=True)

    data = json.loads(response.get_data(as_text=True))

    # should return more than 5000 product names if everything works well
    assert response.status_code == 200
    assert len(data) == 4
    assert data['name'] == 'BROOD NS'
    assert data['selling_price'] is not None
