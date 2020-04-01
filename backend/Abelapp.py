from flask import Flask, escape, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['DEBUG'] = True

# app configurations for database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://tm69H1sxd0:xnSlasPerh@remotemysql.com:3306/tm69H1sxd0?charset=utf8mb4'

db = SQLAlchemy(app)


# product table in database
class Product(db.Model):
    plu = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    buying_price = db.Column(db.Integer)
    selling_price = db.Column(db.Integer)
    discount = db.Column(db.Integer)
    transaction_id = db.Column(db.Integer, db.ForeignKey('transaction.id'))

# transaction table in database
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_time = db.Column(db.DateTime)
    receipt_number = db.Column(db.Integer)
    total_amount = db.Column(db.Integer)
    card_serial = db.Column(db.Integer)
    change = db.Column(db.Integer)
    products = db.relationship('Product', backref='contains')


@app.route('/')
def hello():
    name = request.args.get("name", "World")
    return f'Hello, {escape(name)}!'


@app.route('/getproducts')
def getProducts():
    print(Product.query.all())
    return '<h1>Success</h1>'


@app.route('/addproduct/plu=<plu>/name=<name>')
def addProduct(plu, name):
    newProduct = Product(plu=plu, name=name)
    db.session.add(newProduct)
    db.session.commit()
    return '<h1>Success</h1>

#Newly added by Abel but untested:
@app.route('/getsales/day/day=<date_time>')
def getSales(date_time):
    print(Transaction.query.get_or_404(date_time)) #or date_time=date_time
    return '<h1>Success</h1>'

@app.route('/getproduct/plu=<plu>')
def getProduct(plu):
    print(Product.query.get_or_404(plu)) #or plu=plu
    return '<h1>Success</h1>'

@app.route('/updateproductbprice/plu=<plu>/newprice=<newprice>')
def updateProductBPrice(plu, newprice):
    prod = Product.query.get_or_404(plu) #or plu=plu
    prod.buying_price = newprice; # unsure how to update existing fields. Does this update it locally or in the database?
    db.session.commit()
    return '<h1>Success</h1>

@app.route('/updateproductsprice/plu=<plu>/newprice=<newprice>')
def updateProductSPrice(plu, newprice):
    prod = Product.query.get_or_404(plu) #or plu=plu
    prod.selling_price = newprice; # unsure how to update existing fields. Does this update it locally or in the database?
    db.session.commit()
    return '<h1>Success</h1>
