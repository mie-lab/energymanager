import numpy as np
import base64
from flask import Flask, jsonify, request, after_this_request
from flask_cors import CORS

from backend.process_floorplan import process_floorplan

app = Flask(__name__)
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"


@app.route("/", methods=["GET"])
def test_method():
    return jsonify("Welcome to EnergyManager")


@app.route("/process_floorplan", methods=["GET", "POST"])
def call_process_floorplan():
    # get image and image shape
    print("ARGS", request.args)
    file = request.args.get("image_data")
    print("Image shape arg", request.args.get("image_shape"))
    shape = eval(request.args.get("image_shape"))
    # decode
    b64file = base64.b64decode(file)
    img = np.fromstring(b64file, np.uint8).reshape(shape)

    # run img processing
    out = process_floorplan(img)

    # return output
    return jsonify(str(out))


if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=8989)
