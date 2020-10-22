import flask
import json
import io
import os

from .window import UIWindow

shared_application = None

app = flask.Flask(__name__)


@app.route('/favicon.ico')
def get_favicon():
    return flask.send_file('images/favicon.ico')

@app.route('/<windowname>')
def index(windowname):
    return shared_application.renderWindow(windowname)

@app.route('/')
def main_index():
    return shared_application.renderWindow('main')

class Application:
    def __init__(self):
        global shared_application
        if shared_application is not None:
            return shared_application
        shared_application = self
        
        self.flask_app = app
        self.port = 5050
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
        self.flask_app.run(port=self.port)

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


