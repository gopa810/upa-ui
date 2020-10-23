import flask
from flask import jsonify, make_response
import json
import io
import os
 
from .window import UIWindow

PORT_HTTP = 5050

shared_application = None

app = flask.Flask(__name__)

@app.route('/favicon.ico')
def get_favicon():
    return flask.send_file('images/favicon.ico')

@app.route('/<file>')
def index_file(file):
    return flask.send_file('static/' + file)

@app.route('/images/<file>')
def index(file):
    return flask.send_file('images/' + file)

@app.route("/service", methods=["POST"])
def service_request():
    if flask.request.is_json:
        req = flask.request.get_json()
        if isinstance(req, list):
            response_body = {
                'message': 'list',
                'response': req
            }
        elif isinstance(req, dict):
            response_body = {
                "message": "dictionary",
                "sender": req
            }
        res = make_response(jsonify(response_body), 200)
        return res
    else:
        return make_response(jsonify({"message": "Request body must be JSON"}), 400)

@app.route('/')
def main_index():
    return flask.send_file('static/main.html')
    #return shared_application.renderWindow('main')

class Application:
    def __init__(self):
        global shared_application
        if shared_application is not None:
            return shared_application
        shared_application = self
        
        self.flask_app = app
        self.port = PORT_HTTP
        self.need_exit = False
        self.windows = {}

    def getWindow(self, name=None):
        if name is None:
            name = 'main'

        return UIWindow(name=name, data=self.windows)

    def renderWindow(self, windowname):
        if windowname not in self.windows:
            raise Exception("Undefined window: " + windowname)
        return UIWindow.html(windowname, self.windows)

    def start(self):
        print("Starting servers...")
        #t1 = threading.Thread(target=run_ws_server2)
        #t1.start()
        #socketio.run(ws_app, port=PORT_WS)
        #run_ws_server()
        #run_http_server()
        self.flask_app.run(port=PORT_HTTP)
        #asyncio.run(main_process())
        #wsel.stop()

    def loadUI(self, fileid):
        data = {}
        if isinstance(fileid, io.IOBase):
            data = json.load(fileid)
        elif isinstance(fileid,str) and os.path.exists(fileid):
            with open(fileid,"rt",encoding='utf-8') as rf:
                data = json.load(rf)
        else:
            raise Exception('Unknown argument type: ' + type(fileid))
        
        self.windows = data


