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

Now you can run your Flask app by typing `flask run`. If everything runs smoothly, you will see a confirmation message and by opening http://127.0.0.1:5000/ in your browser, you can see a webpage.

Folder structure:

app.py: The main flask app is located here \
config.py: Contains the configuration values for app.py \
credentials.ini: Contains the credentials to connect with the database \
models.py: Contains the database tables \
views.py: Gathers all the routes from the blueprints \
blueprints: Folder where each file is a flask blueprint \
