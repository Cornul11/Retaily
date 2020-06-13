from flask import json

from app import app


def test_sales():
    test_sales_name()

    test_sales_plu()

    test_period_sales_name()

    test_period_sales_plu()


def test_sales_name():
    # testing based on a name
    product_name = 'BROOD NS'
    response = app.test_client().get(
        '/verkoop/kort/?name=' + product_name,
        follow_redirects=True
    )

    data = json.loads(response.get_data(as_text=True))

    assert response.status_code == 200
    assert len(data) == 4
    assert data['sales_last_month'] >= 0
    assert data['sales_last_quarter'] is not None


def test_sales_plu():
    # testing based on a PLU
    product_plu = 10070
    response = app.test_client().get(
        '/verkoop/kort/?plu=' + str(product_plu),
        follow_redirects=True
    )

    data = json.loads(response.get_data(as_text=True))

    assert response.status_code == 200
    assert len(data) == 4
    assert data['sales_last_month'] >= 0
    assert data['sales_last_quarter'] is not None


def test_period_sales_name():
    # testing based on a time period and name with an interval of days
    product_name = 'BROOD NS'
    start_date = '2019-09-01'
    end_date = '2020-05-01'
    interval = 'day'
    response = app.test_client().get(
        '/verkoop/?name=' + product_name + '&start=' + start_date + '&end=' + end_date + '&interval=' + interval,
        follow_redirects=True
    )

    data = json.loads(response.get_data(as_text=True))

    assert response.status_code == 200
    assert len(data) == 244
    assert data[0]['t'] == '2019-09-01 00:00'
    assert data[0]['y'] >= 0
    assert data[1]['y'] is not None


def test_period_sales_plu():
    # testing based on a time period and plu with an interval of hours
    product_plu = '10070'
    start_date = '2017-09-01'
    end_date = '2018-05-01'
    interval = 'hour'
    response = app.test_client().get(
        '/verkoop/?plu=' + str(product_plu) + '&start=' + start_date + '&end=' + end_date + '&interval=' + interval,
        follow_redirects=True
    )

    data = json.loads(response.get_data(as_text=True))

    assert response.status_code == 200
    assert len(data) == 5832
    assert data[0]['t'] == '2017-09-01 00:30'
    assert data[0]['y'] >= 0
    assert data[1]['y'] is not None
