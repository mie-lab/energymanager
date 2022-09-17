import os
import numpy as np
import torch

from backend.floortrans.hg_furukawa_original import get_model
from backend.floortrans.plotting import polygons_to_image
from backend.floortrans.post_prosessing import split_prediction, get_polygons


def load_model(model_path=os.path.join("backend", "floortrans", "model_best_val_loss_var.pkl")):
    # Setup Model
    model = get_model("hg_furukawa_original", 51)

    n_classes = 44
    model.conv4_ = torch.nn.Conv2d(256, n_classes, bias=True, kernel_size=1)
    model.upsample = torch.nn.ConvTranspose2d(n_classes, n_classes, kernel_size=4, stride=4)
    checkpoint = torch.load(model_path, map_location=torch.device("cpu"))

    model.load_state_dict(checkpoint["model_state"])
    model.eval()
    print("Model loaded.")
    return model


def segment_img(img, model):
    img = preprocess_img(img)
    segmented_img = model(img.float())
    # post processing
    rooms = post_process(segmented_img)

    # fill the ones that are inside but were not detected correctly
    rooms = fill_grundriss(rooms)
    return rooms


def post_process(model_pred_img):
    split = [21, 12, 11]
    heatmaps, rooms, icons = split_prediction(model_pred_img, (1048, 2848), split)
    polygons, types, room_polygons, room_types = get_polygons((heatmaps, rooms, icons), 0.2, [1, 2])
    pol_room_seg, _ = polygons_to_image(polygons, types, room_polygons, room_types, 1048, 2848)
    return pol_room_seg


def preprocess_img(img_in, x_min=0, x_max=-1, y_min=0, y_max=-1):
    img = img_in.astype(float) / 255 * 2 - 1
    img = img[x_min:x_max, y_min:y_max]
    return torch.from_numpy(np.expand_dims(np.moveaxis(img, -1, 0), 0)).float()


def fill_grundriss(rooms):
    binary_rooms = rooms > 0
    max_label_sofar = np.max(rooms)

    # we check the pixels that are zero (no room) by index
    inds_out_x, inds_out_y = np.where(~binary_rooms)
    inds_in_x, inds_in_y = np.where(binary_rooms)
    min_in_x, max_in_x, min_in_y, max_in_y = inds_in_x[0], inds_in_x[-1], np.min(inds_in_y), np.max(inds_in_y)

    # only consider the once that are above and below the first ones:
    x_above_min = inds_out_x > min_in_x
    x_below_max = inds_out_x < max_in_x
    inds_out_x = inds_out_x[x_above_min & x_below_max]
    inds_out_y = inds_out_y[x_above_min & x_below_max]
    # same for y
    y_above_min = inds_out_y > min_in_y
    y_below_max = inds_out_y < max_in_y
    inds_out_x = inds_out_x[y_above_min & y_below_max]
    inds_out_y = inds_out_y[y_above_min & y_below_max]

    # iterate over the left over points that are critical and decide whether they are at an edge or inside
    rooms_filled = rooms.copy()
    current_x = -1
    for x_out, y_out in zip(inds_out_x, inds_out_y):
        if x_out != current_x:
            current_y_where = np.where(binary_rooms[x_out])[0]
            current_y_min, current_y_max = current_y_where[0], current_y_where[-1]
            current_x = x_out
        current_x_where = np.where(binary_rooms[:, y_out])[0]
        if (
            x_out > current_x_where[0]
            and x_out < current_x_where[-1]
            and y_out > current_y_min
            and y_out < current_y_max
        ):
            rooms_filled[x_out, y_out] = max_label_sofar + 1
    return rooms_filled
