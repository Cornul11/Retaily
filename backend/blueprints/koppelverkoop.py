import datetime

from flask import Blueprint, request, make_response, jsonify, abort

from app import db
from models import Product, Transaction

# Define the blueprint
koppelverkoop_bp = Blueprint("koppelverkoop", __name__)


def get_koppel_products(plu, name, start, end):
    trans_ids = get_id(plu, name, start, end)
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
        k_name = data[0]
        count = 1
        for i in range(1, len(data)):
            if k_name == data[i]:
                count += 1
            else:
                final.append({"name": k_name, "count": count})
                k_name = data[i]
                count = 1
        final.append({"name": k_name, "count": count})
    final.sort(key=lambda x: x["count"], reverse=True)
    return [{"name": "Geselecteerd Product: " + name, "count": ""}] + final[:10]


def get_id(plu, name, start, end):
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
        start = request.args.get("start", None)
        end = request.args.get("end", None)
        try:
            start = datetime.datetime.strptime(start, "%Y-%m-%d")
            end = datetime.datetime.strptime(end, "%Y-%m-%d")
        except:
            abort(400)
        if plu is None and name == "":
            response = make_response(
                jsonify(message="Voer een product naam in"), 400)
            abort(response)
        elif plu == "" and name is None:
            response = make_response(
                jsonify(message="Voer een PLU code in"), 400)
            abort(response)
        if name is None:
            product = Product.query.filter(Product.plu == plu).first()
            if product is None:
                response = make_response(
                    jsonify(message="EAN code niet gevonden"), 400)
                abort(response)
            name = product.serialized["name"]
        elif plu is None:
            product = Product.query.filter(Product.name == name).first()
            if product is None:
                response = make_response(
                    jsonify(message="Product naam niet gevonden"), 400)
                abort(response)
        return jsonify(get_koppel_products(plu, name, start, end))
