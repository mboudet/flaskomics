from askomics.libaskomics.Database import Database
from askomics.libaskomics.Params import Params


class ConstraintManager(Params):
    """Manage constraints

    Attributes
    ----------
    namespace_internal : str
        askomics namespace, from config file
    namespace_data : str
        askomics prefix, from config file
    prefix : dict
        dict of all prefixes
    """

    def __init__(self, app, session):
        """init

        Parameters
        ----------
        app : Flask
            Flask app
        session :
            AskOmics session
        """
        Params.__init__(self, app, session)

    def list_constraints(self):
        """Get all ontologies

        Returns
        -------
        list
            ontologies
        """

        database = Database(self.app, self.session)

        query = '''
        SELECT id, entity_uri, json
        FROM constraints
        '''

        rows = database.execute_sql_query(query)

        constraints = []
        for row in rows:
            constraint = {
                'id': row[0],
                'entity_uri': row[1],
                'json': row[2]
            }
            constraints.append(constraint)

        return constraints

    def add_constraint(self, uri, content):
        """Create a new ontology

        Returns
        -------
        list of dict
            Prefixes information
        """
        database = Database(self.app, self.session)
        query = '''
        INSERT INTO ontologies VALUES(
            NULL,
            ?,
            ?,
        )
        '''

        database.execute_sql_query(query, (uri, content))

    def remove_constraint(self, id):
        """Remove constraint

        Returns
        -------
        None
        """

        database = Database(self.app, self.session)

        query = '''
        DELETE FROM constraints
        WHERE id = ?
        '''

        database.execute_sql_query(query, (id,))
