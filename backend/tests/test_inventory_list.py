from flask import json

from app import app


def test_inventory_list():
    response = app.test_client().get(
        '/inventaris/tabel'
    )

    data = json.loads(response.get_data(as_text=True))

    # should return more than 5000 product names if everything works well
    assert response.status_code == 200
    assert len(data) >= 5000
