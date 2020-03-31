First create a route for flask:
`@app.route('/YOUR_ROUTE/parameter1=<value1>/parameter2=<value2>`
- YOUR_ROUTE: here you specify the route e.g. product/plu=<plu>/name=<name>
- You can use as much parameters as you want by extending with `/parameterX=<valueX>

after ```@app.route('...')``` you create a method which will be executed when the endpoint is called:
```def method(parameter1, parameter2 etc...:)```

In that method you can do a few things.

The first thing you can do is add a tuple to the database:
```newTuple = TableName(columnname=parameter1, columname=parameter2)
db.session.add(newTuple)
db.session.commit()
return '<h1>Success</h1>'```

Another thing you can do is a query on the database:
```Tablename.query.#here you specify the query properties e.g. all()```

Examples:
```@app.route('/addproduct/plu=<plu>/name=<name>')
def addProduct(plu, name):
    newProduct = Product(plu=plu, name=name)
    db.session.add(newProduct)
    db.session.commit()
    return '<h1>Success</h1>```


```@app.route('/getproducts')
def getProducts():
    print(Product.query.all())
    return '<h1>Success</h1>'```
