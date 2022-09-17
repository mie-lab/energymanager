import numpy as np
from flask import Flask, jsonify, request, after_this_request

from backend.process_floorplan import process_floorplan

app = Flask(__name__)


@app.route("/process_floorplan", methods=["GET"])
def call_process_floorplan():
    out = process_floorplan(np.random.rand(4, 5))
    return jsonify(str(out))


if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=8989)
