from PIL import Image
import numpy as np
import io
import base64
import ast
from flask import Flask, jsonify, request, after_this_request
from flask_cors import CORS

from backend.process_floorplan import process_floorplan

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET", "POST"])
def test_method():
    return jsonify("Welcome to EnergyManager")


@app.route("/process_floorplan", methods=["GET", "POST"])
def call_process_floorplan():
    # get image and image shape
    args = ast.literal_eval(request.data.decode("utf-8"))
    shape = eval(args.get("image_shape"))
    # decode
    b64file = base64.b64decode(args.get("image_data"))
    image = Image.open(io.BytesIO(b64file))
    img = np.array(image)

    # run img processing
    out = process_floorplan(img)

    # return output
    response = jsonify(str(out))
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=8989)
