from flask import Flask, render_template, url_for
import time
import os

def my_url_for(endpoint, **values):
    url = url_for(endpoint, **values) 
    return url + '?ts={}'.format(int(time.time()))

app = Flask(__name__)

@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)

def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path,
                                     endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)

app.jinja_env.globals['url_for'] = my_url_for

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()
