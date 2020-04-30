from flask import Blueprint, request, jsonify, abort
from models import Product, Transaction
from app import db
import datetime

# Define the blueprint
koppelverkoop_bp = Blueprint("koppelverkoop", __name__)


def get_koppelProducts(plu, name, days, end):
    trans_ids = get_id(plu, name, days, end)
    trans_ids = list(set(trans_ids))
    data = []
    for trans_id in trans_ids:
        products = Product.query.filter(
            (Product.transaction_id == trans_id) & (Product.plu != plu)
        )
        for product in products:
            data.append(product.serialized["name"])
    data.sort()
    final = []
    if len(data) > 0:
        name = data[0]
        count = 1
        for i in range(1, len(data)):
            if name == data[i]:
                count += 1
            else:
                final.append({"name": name, "count": count})
                name = data[i]
                count = 1
        final.append({"name": name, "count": count})
    final.sort(key=lambda x: x["count"], reverse=True)
    return final[:10]


def get_id(plu, name, days, end):
    start = end - datetime.timedelta(days=days)
    if plu is not None:
        data = []
        items = (
            db.session.query(Product, Transaction)
            .join(Transaction)
            .filter(
                (Product.plu == plu)
                & (Transaction.date_time >= start)
                & (Transaction.date_time <= end)
            )
        )
        for item in items:
            data.append(item.Product.serialized["transaction_id"])
        return data
    else:
        data = []
        items = (
            db.session.query(Product, Transaction)
            .join(Transaction)
            .filter(
                (Product.name == name)
                & (Transaction.date_time >= start)
                & (Transaction.date_time <= end)
            )
        )
        for item in items:
            data.append(item.Product.serialized["transaction_id"])
        return data


@koppelverkoop_bp.route("/lijst/", methods=["GET"])
def lijst():
    if request.method == "GET":
        plu = request.args.get("plu", None)
        name = request.args.get("name", None)
        if plu is None and name is None:
            abort(400)
        end = datetime.datetime.now()
        return jsonify({"koppelproducts": get_koppelProducts(plu, name, 365, end),})
