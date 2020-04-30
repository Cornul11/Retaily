from flask import Blueprint, request, jsonify, abort
from models import Product

# Define the blueprint
inventory_bp = Blueprint("inventory", __name__)


def get_counts(result):
    data = []
    if len(result) > 0:
        name = result[0]["name"]
        plu = result[0]["plu"]
        count = 1
        for i in range(1, len(result)):
            if name == result[i]["name"]:
                count = count + 1
            else:
                data.append({"plu": plu, "name": name, "count": count})
                name = result[i]["name"]
                plu = result[i]["plu"]
                count = 1
        data.append({"plu": plu, "name": name, "count": count})
    return data


# Define the routes
@inventory_bp.route("/", methods=["GET"])
def inventory():
    if request.method == "GET":
        plu = request.args.get("plu", None)
        name = request.args.get("name", None)
        if plu is None and name is None:
            products = Product.query.filter(Product.transaction_id is None).order_by(
                Product.name
            )
            return jsonify(
                {"products": get_counts([product.serialized for product in products])}
            )
        elif plu is not None:
            products = Product.query.filter(
                (Product.plu == plu) & (Product.transaction_id is None)
            ).order_by(Product.name)
        else:
            products = Product.query.filter(
                (Product.name == name) & (Product.transaction_id is None)
            ).order_by(Product.name)
        result = get_counts([product.serialized for product in products])
        if len(result) > 0:
            return jsonify(result[0])
        return abort(400)
