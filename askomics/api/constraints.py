import traceback
import sys

from askomics.api.auth import api_auth, login_required_query
from askomics.libaskomics.ConstraintManager import ConstraintManager

from flask import (Blueprint, current_app, jsonify, session)


constraints_bp = Blueprint('constraints', __name__, url_prefix='/')


@constraints_bp.route('/api/constraints', methods=['GET'])
@api_auth
@login_required_query
def get_constraints():
    """Get ...

    Returns
    -------
    json
        constraints: list of all constraints
        error: True if error, else False
        errorMessage: the error message of error, else an empty string
    """
    try:
        cm = ConstraintManager(current_app, session)
        constraints = cm.list_constraints()
    except Exception as e:
        traceback.print_exc(file=sys.stdout)
        return jsonify({
            'constraints': [],
            'error': True,
            'errorMessage': str(e)
        }), 500

    return jsonify({
        'constraints': constraints,
        'error': False,
        'errorMessage': ''
    })
