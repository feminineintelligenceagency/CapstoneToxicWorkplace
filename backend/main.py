from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import os
from subprocess import Popen, PIPE

app = Flask(__name__)
CORS(app)

guesses = {}

@app.route("/api", methods=['GET'])
def index():
    return "This is an API, you shouldn't be here..."

@app.route("/api/player/<playernum>", methods=['GET'])
def player(playernum):
    global guesses
    return jsonify({
        "player": playernum,
        "guesses": guesses.get(playernum, [])
    }), 200

@app.route("/api/player/<playernum>/guess", methods=['POST'])
def post_guess(playernum):
    body = request.get_json()
    global guesses
    g = guesses.get(playernum, [])
    g.append(body.get("guess"))
    guesses[playernum] = g
    p = Popen(["bun", "node", "/var/srv/rolegame.js", str(playernum)], stdout=PIPE, stderr=PIPE)
    stdout, stderr = p.communicate()
    return Response(stdout.take('\n'), status=200)

@app.route("/api/player/<playernum>/guess/<guessval>", methods=['POST'])
def post_guess_val(playernum, guessval):
    body = request.get_json()
    global guesses
    g = guesses.get(playernum, [])
    g.append(body.get("guess"))
    guesses[playernum] = g
    p = Popen(["bun", "node", "/var/srv/rolegame.js", str(playernum), "--guess-val", guessval], stdout=PIPE, stderr=PIPE)
    stdout, stderr = p.communicate()
    return Response(stdout.take('\n'), status=200)

def main():
    app.run(port=6502)

if __name__ == "__main__":
    main()



