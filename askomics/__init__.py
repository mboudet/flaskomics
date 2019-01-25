"""Define a Flask app
"""
from flask import Flask, session, jsonify
from flask_ini import FlaskIni
from functools import wraps

app = Flask(__name__)
app.iniconfig = FlaskIni()
with app.app_context():
    app.iniconfig.read('config/askomics.ini')

app.secret_key = app.iniconfig.get('flask', 'secret_key')

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        """Login required decorator
        """

        if 'user' in session:
            if not session['user']['blocked']:
                return f(*args, **kwargs)
            return jsonify({"error": True, "errorMessage": "Blocked account"}), 401
        return jsonify({"error": True, "errorMessage": "Login required"}), 401

    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        """Login required decorator
        """

        if 'user' in session:
            if not session['user']['admin']:
                return f(*args, **kwargs)
            return jsonify({"error": True, "errorMessage": "Admin required"}), 401
        return jsonify({"error": True, "errorMessage": "Login required"}), 401

    return decorated_function

import askomics.routes.views.view
import askomics.routes.api.api
import askomics.routes.api.authentication
import askomics.routes.views.catch_url