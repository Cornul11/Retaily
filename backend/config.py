import configparser


# Function to create SQLALCHEMY_DATABASE_URI
def create_uri():
    config = configparser.ConfigParser()
    config.read("credentials.ini")
    db_username = config["database"]["db_username"]
    db_password = config["database"]["db_password"]
    db_hostname = config["database"]["db_hostname"]
    db_port = config["database"]["db_port"]
    db_database = config["database"]["db_database"]
    db_protocol = "mysql+pymysql"
    db_charset = "utf8mb4"
    db_uri = "%s://%s:%s@%s:%s/%s?charset=%s" % (
        db_protocol,
        db_username,
        db_password,
        db_hostname,
        db_port,
        db_database,
        db_charset,
    )
    return db_uri


# Configuration parameters
DEBUG = True
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_DATABASE_URI = create_uri()
