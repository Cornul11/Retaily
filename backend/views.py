from app import app
from models import Product, Transaction
from blueprints.inventory import inventory_bp
from blueprints.product import product_bp
from blueprints.sales import sales_bp
from blueprints.koppelverkoop import koppelverkoop_bp


# Register the blueprints
app.register_blueprint(inventory_bp, url_prefix="/inventory")
app.register_blueprint(product_bp, url_prefix="/product")
app.register_blueprint(sales_bp, url_prefix="/sales")
app.register_blueprint(koppelverkoop_bp, url_prefix="/koppelverkoop")
