"""
This code and the pretrained model is taken from the CubiCasa repository
(https://github.com/CubiCasa/CubiCasa5k) available under Creative Commons
Attribution-NonCommercial 4.0 International License.
"""
import numpy as np
from skimage import draw
from shapely.geometry import Polygon, Point


def polygons_to_image(polygons, types, room_polygons, room_types, height, width):
    pol_room_seg = np.zeros((height, width))
    pol_icon_seg = np.zeros((height, width))

    for i, pol in enumerate(room_polygons):

        mask = shp_mask(pol, np.arange(width), np.arange(height))

        #         jj, ii = draw.polygon(pol[:, 1], pol[:, 0])
        pol_room_seg[mask] = room_types[i]["class"]

    for i, pol in enumerate(polygons):
        jj, ii = draw.polygon(pol[:, 1], pol[:, 0])
        if types[i]["type"] == "wall":
            pol_room_seg[jj, ii] = types[i]["class"]
        else:
            pol_icon_seg[jj, ii] = types[i]["class"]

    return pol_room_seg, pol_icon_seg


def _grid_bbox(x, y):
    dx = dy = 0
    return x[0] - dx / 2, x[-1] + dx / 2, y[0] - dy / 2, y[-1] + dy / 2


def _bbox_to_rect(bbox):
    l, r, b, t = bbox
    return Polygon([(l, b), (r, b), (r, t), (l, t)])


def shp_mask(shp, x, y, m=None):
    """
    Adapted from code written by perrette
    form: https://gist.github.com/perrette/a78f99b76aed54b6babf3597e0b331f8
    Use recursive sub-division of space and shapely contains method to create a raster mask on a regular grid.

    Parameters
    ----------
    shp : shapely's Polygon (or whatever with a "contains" method and intersects method)
    x, y : 1-D numpy arrays defining a regular grid
    m : mask to fill, optional (will be created otherwise)

    Returns
    -------
    m : boolean 2-D array, True inside shape.

    Examples
    --------
    >>> from shapely.geometry import Point
    >>> poly = Point(0,0).buffer(1)
    >>> x = np.linspace(-5,5,100)
    >>> y = np.linspace(-5,5,100)
    >>> mask = shp_mask(poly, x, y)
    """
    rect = _bbox_to_rect(_grid_bbox(x, y))

    if m is None:
        m = np.zeros((y.size, x.size), dtype=bool)

    if not shp.intersects(rect):
        m[:] = False

    elif shp.contains(rect):
        m[:] = True

    else:
        k, l = m.shape

        if k == 1 and l == 1:
            m[:] = shp.contains(Point(x[0], y[0]))

        elif k == 1:
            m[:, : l // 2] = shp_mask(shp, x[: l // 2], y, m[:, : l // 2])
            m[:, l // 2 :] = shp_mask(shp, x[l // 2 :], y, m[:, l // 2 :])

        elif l == 1:
            m[: k // 2] = shp_mask(shp, x, y[: k // 2], m[: k // 2])
            m[k // 2 :] = shp_mask(shp, x, y[k // 2 :], m[k // 2 :])

        else:
            m[: k // 2, : l // 2] = shp_mask(shp, x[: l // 2], y[: k // 2], m[: k // 2, : l // 2])
            m[: k // 2, l // 2 :] = shp_mask(shp, x[l // 2 :], y[: k // 2], m[: k // 2, l // 2 :])
            m[k // 2 :, : l // 2] = shp_mask(shp, x[: l // 2], y[k // 2 :], m[k // 2 :, : l // 2])
            m[k // 2 :, l // 2 :] = shp_mask(shp, x[l // 2 :], y[k // 2 :], m[k // 2 :, l // 2 :])

    return m
