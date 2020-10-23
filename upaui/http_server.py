import flask
import os.path

PORT_HTTP = 5050


app = flask.Flask(__name__)
curr_dir = os.path.dirname(os.path.abspath(__file__))

@app.route('/favicon.ico')
def get_favicon():
    path = os.path.join(curr_dir, 'images', 'favicon.ico')
    return flask.send_file(path)

@app.route('/<file>')
def index_file(file):
    return flask.send_file(os.path.join('static', file))

@app.route('/images/<file>')
def index(file):
    return flask.send_file(os.path.join(curr_dir, 'images', file))

@app.route('/')
def main_index():
    return flask.send_file('static/main.html')

if __name__=='__main__':
    app.run(port=PORT_HTTP)
