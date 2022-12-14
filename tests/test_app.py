import numpy as np
import matplotlib.pyplot as plt
import requests
import ast
import base64


def test_post_img():
    img = plt.imread("../CubiCasa5k/data/IMG_4238_compressed.jpg")
    parameters = {"image_data": base64.b64encode(img), "image_shape": str(img.shape)}
    ret = requests.post("http://localhost:8989/process_floorplan", data=parameters)
    print("Output shape", ret.json())
    assert "200" in str(ret)


if __name__ == "__main__":
    test_post_img()
