import numpy as np
from scipy import ndimage
import pytesseract

from backend.segment import segment_img, load_model

# A3 has size 0.297m x 0.42m
format_mapping = {"A3": (0.297, 0.42)}


def retrieve_masstab(text_in_img):
    # get image format
    img_format = "A3" if "A3" in text_in_img else "A4"
    # retrieve masstab bei 1:
    masstab = [elem for elem in text_in_img.split("\n") if "1:" in elem]
    assert len(masstab) == 1
    masstab = (masstab[0].split(":")[1]).split(" ")[0]
    return masstab, format_mapping[img_format]


def get_address(text_in_img):
    address = [elem for elem in text_in_img.split("\n") if ", Schweiz" in elem]
    assert len(address) == 1
    return address[0]


def get_pixel_to_length_factor(img_shape, text):
    # get masstab and paper format
    masstab, paper_size_m = retrieve_masstab(text)
    # flip if necessary (hochkant vs querformat)
    paper_size_m = np.array(paper_size_m)
    if img_shape[0] > img_shape[1]:
        paper_size_m = np.flip(paper_size_m)
    # get paper size per pixel
    factor = (paper_size_m / np.array(img_shape[:2])) * int(masstab)
    assert np.isclose(factor[0], factor[1], 1e-4, 1e-4)
    return np.mean(factor)


def process_floorplan(floorplan_img):

    # retrieve all text on the paper
    text = pytesseract.image_to_string(floorplan_img)
    # get address from text
    address_elems = [elem for elem in text.split("\n") if ", Schweiz" in elem]
    assert len(address_elems) == 1
    building_address = address_elems[0]
    # return floorplan_img.shape
    pixel_length_factor = get_pixel_to_length_factor(floorplan_img.shape, text)
    print(f"One pixel corresponds to {pixel_length_factor} meters")

    # pass floorplan through model
    model = load_model()
    rooms = segment_img(floorplan_img, model)

    # Compute area and wall sizes
    binary_rooms = (rooms > 0).astype(int)
    inds_rooms, _ = np.where(binary_rooms)
    # area
    building_area = len(inds_rooms) * pixel_length_factor ** 2
    # umfang
    umfang_pixels = np.where(binary_rooms - ndimage.morphology.binary_dilation(binary_rooms))[0]
    # multiply by pixel-meter factor to get umfang
    umfang = len(umfang_pixels) * pixel_length_factor
    print("room area and umfang", building_area, umfang)

    # make visualization
    # Attention: current visualization is random! should be merged with sensors
    rand_mapping = {room_nr: [np.random.rand(), 0, np.random.rand()] for room_nr in np.unique(rooms)[1:]}
    coloured_rooms = np.zeros((list(rooms.shape) + [3])).astype(np.uint8)
    for key, rgb in rand_mapping.items():
        coloured_rooms[rooms == key] = (np.array(rgb) * 255).astype(np.uint8)

    final_dict = {"visualization": coloured_rooms, "area": building_area, "address": building_address, "umfang": umfang}
    return final_dict


def load_floorplan_from_pdf(file_path):
    # ONLY FOR TESTING
    # os.path.join(floor_plan_path, "Zug TH1b/ZUG-TH01b_04_IST_20210302.pdf")
    # "Steinhausen/SHU-01_02_IST_20161103.pdf")
    from pdf2image import convert_from_path

    floor_plan_path = "../Floor Plans/"
    img = convert_from_path(file_path)[0]
    return np.array(img)

