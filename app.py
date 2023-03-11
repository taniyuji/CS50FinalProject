from flask import Flask, render_template, request, session, g
import sqlite3

dbname = 'urchin_ranking.sqlite'

app = Flask(__name__)

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(dbname)
    return g.db

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=["POST"])
def register():

    input_name = request.form["playerName"]
    input_score = request.form["playerScore"]

    con = get_db()
    cur = con.cursor()
    cur.execute("insert into ranking_users(name, score) values(?, ?);", (input_name, input_score))
    con.commit()

    cur.execute("select * from ranking_users order by score desc")
    data = cur.fetchall()
    con.close()

    return render_template('ranking.html', data=data)


if __name__ == '__main__':
    app.run()
