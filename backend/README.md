Prerequisites:

- python3
- python3-pip

Install these, and their dependencies.

Install `virtualenv` using pip3 => `sudo pip3 install virtualenv`.

In order to run this on Linux, for convenience, first of all create a virtual environment using:
`virtualenv -p python3 venv`

Next, install all the packages required for running Flask:
`pip3 install -r requirements.txt`

In addition, you need to set the environment as a development environment using the following command on Linux systems:
`export FLASK_ENV=development`.

In order to get a connection with the mysql database, you should set the `SQLALCHEMY_DATABASE_URI` according to your configuration. Note that the database should already exist. Tables in the database can be created by `class Tablename(db.Model)` and then specifying the columns in that function. Before you execute the command `flask run`, you should open a terminal with the virtual environment (venv). Run `python` in that terminal and execute the lines: `from app import db` and `db.create_all(). Now you are ready to interact with the mysql database.

Now you can run your Flask app by typing `flask run`. If everything runs smoothly, you will see a confirmation message and by opening http://127.0.0.1:5000/ in your browser, you can see a webpage.
