from PIL import Image
import numpy as np
import io
import os
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
    # # get image and image shape
    # args = ast.literal_eval(request.data.decode("utf-8"))
    # # decode
    # b64file = base64.b64decode(args.get("image_data"))
    # image = Image.open(io.BytesIO(b64file))
    # img = np.array(image)
    # debugging:
    img = np.load(os.path.join("tests", "test2.npy"))

    # run img processing
    result_dict = process_floorplan(img)
    # TODO: make visualization work
    del result_dict["visualization"]
    # result_dict = {}
    # result_dict["visualization"] = base64.b64encode(img)
    # print("-----------------------------------")
    # print(result_dict["visualization"])

    # return output
    response = jsonify(result_dict)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=8989)
