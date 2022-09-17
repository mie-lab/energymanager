import numpy as np
import requests
import ast
import base64


def test_post_img():
    img = (np.random.rand(4, 5) * 256).astype(np.uint8)
    parameters = {"image_data": base64.b64encode(img), "image_shape": str(img.shape)}
    ret = requests.post("https://fast-hamlet-23582.herokuapp.com/process_floorplan", params=parameters)
    print("Output shape", ret.json())
    assert "200" in str(ret)


if __name__ == "__main__":
    test_post_img()
