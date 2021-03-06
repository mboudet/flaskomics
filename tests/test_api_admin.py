import json

from . import AskomicsTestCase


class TestApiAdmin(AskomicsTestCase):
    """Test AskOmics API /api/admin/<someting>"""

    def test_get_users(self, client):
        """test the /api/admin/getusers route"""
        client.create_two_users()

        client.log_user("jsmith")
        response = client.client.get('/api/admin/getusers')
        assert response.status_code == 401

        client.log_user("jdoe")
        client.upload()

        response = client.client.get('/api/admin/getusers')
        expected = {
            'error': False,
            'errorMessage': '',
            'users': [{
                'admin': 1,
                'blocked': 0,
                'email': 'jdoe@askomics.org',
                'fname': 'John',
                'galaxy': {"url": "http://localhost:8081", "apikey": "fakekey"},
                'last_action': None,
                'ldap': 0,
                'lname': 'Doe',
                'quota': 0,
                'username': 'jdoe'
            }, {
                'admin': 0,
                'blocked': 0,
                'email': 'jsmith@askomics.org',
                'fname': 'Jane',
                'galaxy': None,
                'last_action': None,
                'ldap': 0,
                'lname': 'Smith',
                'quota': 0,
                'username': 'jsmith'
            }]
        }

        assert response.status_code == 200
        assert response.json == expected

    def test_get_files(self, client):
        """test the /api/admin/getfiles route"""
        client.create_two_users()
        client.log_user("jsmith")

        response = client.client.get('/api/admin/getfiles')
        assert response.status_code == 401

        info = client.upload()
        client.log_user("jdoe")

        response = client.client.get('/api/admin/getfiles')
        expected = {
            'error': False,
            'errorMessage': '',
            'files': [{
                'date': info["transcripts"]["upload"]["file_date"],
                'id': 1,
                'name': 'transcripts.tsv',
                'size': 1986,
                'type': 'csv/tsv',
                'user': 'jsmith'

            }, {
                'date': info["de"]["upload"]["file_date"],
                'id': 2,
                'name': 'de.tsv',
                'size': 819,
                'type': 'csv/tsv',
                'user': 'jsmith'

            }, {
                'date': info["qtl"]["upload"]["file_date"],
                'id': 3,
                'name': 'qtl.tsv',
                'size': 99,
                'type': 'csv/tsv',
                'user': 'jsmith'

            }, {
                'date': info["gene"]["upload"]["file_date"],
                'id': 4,
                'name': 'gene.gff3',
                'size': 2267,
                'type': 'gff/gff3',
                'user': 'jsmith'

            }, {
                'date': info["bed"]["upload"]["file_date"],
                'id': 5,
                'name': 'gene.bed',
                'size': 689,
                'type': 'bed',
                'user': 'jsmith'
            }]
        }

        assert response.status_code == 200
        assert response.json == expected

    def test_get_datasets(self, client):
        """test the /api/admin/getdatasets route"""
        client.create_two_users()
        client.log_user("jsmith")

        response = client.client.get('/api/admin/getdatasets')
        assert response.status_code == 401

        info = client.upload_and_integrate()
        client.log_user("jdoe")

        response = client.client.get('/api/admin/getdatasets')
        expected = {
            'datasets': [{
                'end': info["transcripts"]["end"],
                'error_message': '',
                'id': 1,
                'name': 'transcripts.tsv',
                'ntriples': 0,
                'public': False,
                'start': info["transcripts"]["start"],
                'status': 'success',
                'traceback': None,
                'percent': 100.0,
                'exec_time': info["transcripts"]["end"] - info["transcripts"]["start"],
                'user': 'jsmith'
            }, {
                'end': info["de"]["end"],
                'error_message': '',
                'id': 2,
                'name': 'de.tsv',
                'ntriples': 0,
                'public': False,
                'start': info["de"]["start"],
                'status': 'success',
                'traceback': None,
                'percent': 100.0,
                'exec_time': info["de"]["end"] - info["de"]["start"],
                'user': 'jsmith'
            }, {
                'end': info["qtl"]["end"],
                'error_message': '',
                'id': 3,
                'name': 'qtl.tsv',
                'ntriples': 0,
                'public': False,
                'start': info["qtl"]["start"],
                'status': 'success',
                'traceback': None,
                'percent': 100.0,
                'exec_time': info["qtl"]["end"] - info["qtl"]["start"],
                'user': 'jsmith'
            }, {
                'end': info["gff"]["end"],
                'error_message': '',
                'id': 4,
                'name': 'gene.gff3',
                'ntriples': 0,
                'public': False,
                'start': info["gff"]["start"],
                'status': 'success',
                'traceback': None,
                'percent': 100.0,
                'exec_time': info["gff"]["end"] - info["gff"]["start"],
                'user': 'jsmith'
            }, {
                'end': info["bed"]["end"],
                'error_message': '',
                'id': 5,
                'name': 'gene.bed',
                'ntriples': 0,
                'public': False,
                'start': info["bed"]["start"],
                'status': 'success',
                'traceback': None,
                'percent': 100.0,
                'exec_time': info["bed"]["end"] - info["bed"]["start"],
                'user': 'jsmith'
            }],
            'error': False,
            'errorMessage': ''
        }

        assert response.status_code == 200
        assert response.json == expected

    def test_get_queries(self, client):
        """test the /api/admin/getqueries route"""
        client.create_two_users()
        client.log_user("jsmith")

        response = client.client.get('/api/admin/getqueries')
        assert response.status_code == 401

        client.upload_and_integrate()
        result_info = client.create_result()
        client.publicize_result(result_info["id"], True)

        client.log_user("jdoe")

        with open("tests/results/results_admin.json", "r") as file:
            file_content = file.read()
        raw_results = file_content.replace("###START###", str(result_info["start"]))
        raw_results = raw_results.replace("###END###", str(result_info["end"]))
        raw_results = raw_results.replace("###EXECTIME###", str(int(result_info["end"] - result_info["start"])))
        raw_results = raw_results.replace("###ID###", str(result_info["id"]))
        raw_results = raw_results.replace("###SIZE###", str(result_info["size"]))
        raw_results = raw_results.replace("###PUBLIC###", str(1))
        raw_results = raw_results.replace("###DESC###", "Query")
        expected = json.loads(raw_results)

        response = client.client.get('/api/admin/getqueries')
        assert response.status_code == 200
        assert response.json == expected

    def test_setadmin(self, client):
        """test the /api/admin/setadmin route"""
        client.create_two_users()
        client.log_user("jdoe")
        client.upload()

        set_jsmith_admin = {
            "username": "jsmith",
            "newAdmin": 1
        }

        response = client.client.post('/api/admin/setadmin', json=set_jsmith_admin)
        assert response.status_code == 200
        assert response.json == {'error': False, 'errorMessage': ''}

    def test_set_dataset_public(self, client):
        """test the /api/admin/getdatasets route"""
        client.create_two_users()
        client.log_user("jsmith")

        response = client.client.post('/api/admin/publicize_dataset')
        assert response.status_code == 401

        client.upload_and_integrate()
        client.log_user("jdoe")

        data = {"datasetId": 1, "newStatus": True}

        response = client.client.post('/api/admin/publicize_dataset', json=data)

        assert response.status_code == 200
        assert not response.json["error"]
        assert response.json["errorMessage"] == ''
        assert response.json["datasets"][0]["public"] is True

    def test_set_query_private(self, client):
        """test the /api/admin/publicize_query route"""
        client.create_two_users()
        client.log_user("jsmith")

        response = client.client.post('/api/admin/publicize_query')
        assert response.status_code == 401

        client.upload_and_integrate()
        result_info = client.create_result()
        client.publicize_result(result_info["id"], True)

        client.log_user("jdoe")

        data = {"queryId": result_info["id"], "newStatus": False}
        response = client.client.post('/api/admin/publicize_query', json=data)

        expected = {
            'error': False,
            'errorMessage': '',
            'queries': []
        }

        assert response.status_code == 200
        assert response.json == expected

    def test_setquota(self, client):
        """test the /api/admin/setadmin route"""
        client.create_two_users()
        client.log_user("jdoe")
        client.upload()

        set_quota = {
            "username": "jsmith",
            "quota": "10mb"
        }

        response = client.client.post('/api/admin/setquota', json=set_quota)
        expected = {
            'error': False,
            'errorMessage': '',
            'users': [{
                'admin': 1,
                'blocked': 0,
                'email': 'jdoe@askomics.org',
                'fname': 'John',
                'galaxy': {"url": "http://localhost:8081", "apikey": "fakekey"},
                'last_action': None,
                'ldap': 0,
                'lname': 'Doe',
                'quota': 0,
                'username': 'jdoe'
            }, {
                'admin': 0,
                'blocked': 0,
                'email': 'jsmith@askomics.org',
                'fname': 'Jane',
                'galaxy': None,
                'last_action': None,
                'ldap': 0,
                'lname': 'Smith',
                'quota': 10000000,
                'username': 'jsmith'
            }]
        }

        assert response.status_code == 200
        assert response.json == expected

    def test_setblocked(self, client):
        """test the /api/admin/setblocked route"""
        client.create_two_users()
        client.log_user("jdoe")
        client.upload()

        set_jsmith_admin = {
            "username": "jsmith",
            "newBlocked": 1
        }

        response = client.client.post('/api/admin/setblocked', json=set_jsmith_admin)
        assert response.status_code == 200
        assert response.json == {'error': False, 'errorMessage': ''}

    def test_add_user(self, client):
        """test /api/admin/adduser route"""
        client.create_two_users()
        client.log_user("jdoe")

        data = {
            "fname": "John",
            "lname": "Wick",
            "username": "jwick",
            "email": "jwick@askomics.org"
        }

        response = client.client.post("/api/admin/adduser", json=data)
        password = response.json["user"]["password"]
        apikey = response.json["user"]["apikey"]

        assert response.status_code == 200
        assert response.json == {
            'displayPassword': True,
            'error': False,
            'errorMessage': [],
            'instanceUrl': 'http://localhost:5000',
            'user': {
                'admin': 0,
                'apikey': apikey,
                'blocked': 0,
                'email': 'jwick@askomics.org',
                'fname': 'John',
                'galaxy': None,
                'id': 3,
                'ldap': 0,
                'lname': 'Wick',
                'password': password,
                'quota': 0,
                'username': 'jwick'
            }
        }

    def test_delete_user(self, client):
        """test /api/admin/delete_users route"""
        client.create_two_users()
        client.log_user("jdoe")

        data = {
            "usersToDelete": ["jsmith", "jdoe"]  # jdoe will be removed from the list and no deleted from DB
        }

        response = client.client.post("/api/admin/delete_users", json=data)

        assert response.status_code == 200
        assert response.json == {
            'error': False,
            'errorMessage': [],
            'users': [{
                'admin': 1,
                'blocked': 0,
                'email': 'jdoe@askomics.org',
                'fname': 'John',
                'galaxy': {
                    'apikey': 'fakekey',
                    'url': 'http://localhost:8081'
                },
                'last_action': None,
                'ldap': 0,
                'lname': 'Doe',
                'quota': 0,
                'username': 'jdoe'
            }]
        }

    def test_delete_files(self, client):
        """test /api/admin/delete_files route"""
        client.create_two_users()
        client.log_user("jsmith")

        response = client.client.post('/api/admin/delete_files')
        assert response.status_code == 401
        info = client.upload()
        client.log_user("jdoe")

        data = {
            "filesIdToDelete": [1, 2]
        }

        response = client.client.post('/api/admin/delete_files', json=data)
        expected = {
            'error': False,
            'errorMessage': '',
            'files': [{
                'date': info["qtl"]["upload"]["file_date"],
                'id': 3,
                'name': 'qtl.tsv',
                'size': 99,
                'type': 'csv/tsv',
                'user': 'jsmith'

            }, {
                'date': info["gene"]["upload"]["file_date"],
                'id': 4,
                'name': 'gene.gff3',
                'size': 2267,
                'type': 'gff/gff3',
                'user': 'jsmith'

            }, {
                'date': info["bed"]["upload"]["file_date"],
                'id': 5,
                'name': 'gene.bed',
                'size': 689,
                'type': 'bed',
                'user': 'jsmith'
            }]
        }

        assert response.status_code == 200
        assert response.json == expected

    def test_delete_datasets(self, client):
        """test /api/admin/delete_datasets route"""
        client.create_two_users()
        client.log_user("jsmith")

        response = client.client.post('/api/admin/delete_datasets')
        assert response.status_code == 401

        client.upload_and_integrate()
        client.log_user("jdoe")

        data = {
            "datasetsIdToDelete": [1, 2, 3]
        }

        response = client.client.post('/api/admin/delete_datasets', json=data)

        assert response.status_code == 200
        assert not response.json["error"]
        assert response.json["errorMessage"] == ''
        assert response.json["datasets"][0]["status"] == "queued"
        assert response.json["datasets"][1]["status"] == "queued"
        assert response.json["datasets"][2]["status"] == "queued"
