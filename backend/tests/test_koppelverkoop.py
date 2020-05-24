from flask import json

from app import app


def test_koppelverkoop():
    # testing based on a PLU
    product_plu = 10070
    start_date = '2020-01-01'
    end_date = '2020-05-01'
    response = app.test_client().get(
        '/koppelverkoop/lijst/?plu=' + str(product_plu) + '&start=' + start_date + '&end=' + end_date,
        follow_redirects=True
    )

    data = json.loads(response.get_data(as_text=True))

    assert response.status_code == 200
    assert len(data) == 11
    assert data[0]['name'] == 'Geselecteerd Product: BROOD NS'
