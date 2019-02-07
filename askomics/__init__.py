"""Define a Flask app
"""
from flask import Flask, session, jsonify
from flask_ini import FlaskIni
from functools import wraps
from datetime import timedelta

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
            return jsonify({"error": True, "errorMessage": "Blocked account"})
        return jsonify({"error": True, "errorMessage": "Login required"}), 401

    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        """Login required decorator
        """

        if 'user' in session:
            if session['user']['admin']:
                return f(*args, **kwargs)
            return jsonify({"error": True, "errorMessage": "Admin required"})
        return jsonify({"error": True, "errorMessage": "Login required"}), 401

    return decorated_function

@app.before_request
def make_session_permanent():
    session.permanent = True
    app.permanent_session_lifetime = timedelta(minutes=int(app.iniconfig.get('flask', 'session_timeout')))

import askomics.routes.views.view
import askomics.routes.api.api
import askomics.routes.api.authentication
import askomics.routes.api.admin
import askomics.routes.api.file
import askomics.routes.views.catch_url