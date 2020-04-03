from app import db


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    plu = db.Column(db.BigInteger)
    name = db.Column(db.String(50))
    buying_price = db.Column(db.Float, nullable=True)
    selling_price = db.Column(db.Float, nullable=True)
    discount = db.Column(db.Float, nullable=True)
    transaction_id = db.Column(
        db.Integer, db.ForeignKey("transaction.id"), nullable=True
    )

    @property
    def serialized(self):
        return {
            "id": self.id,
            "plu": self.plu,
            "name": self.name,
            "buying_price": self.buying_price,
            "selling_price": self.selling_price,
            "discount": self.discount,
            "transaction_id": self.transaction_id,
        }


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date_time = db.Column(db.DateTime, nullable=True)
    receipt_number = db.Column(db.Integer, nullable=True)
    total_amount = db.Column(db.Float, nullable=True)
    card_serial = db.Column(db.Integer, nullable=True)
    change = db.Column(db.Float, nullable=True)
    products = db.relationship("Product", backref="contains")

    @property
    def serialized(self):
        return {
            "id": self.id,
            "date_time": self.date_time,
            "receipt_number": self.receipt_number,
            "total_amount": self.total_amount,
            "card_serial": self.card_serial,
            "change": self.change,
        }
