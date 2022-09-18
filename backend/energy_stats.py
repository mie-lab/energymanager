import numpy 
c_air = 1.005 # kJ/ (kg K)
density_air = 1.205 # kg/m3
raumhohe = 2.1

def get_slope(sensor_data):
    # should be sensor data as numpy array ordered by time.
    # get slope between max and min of room cooling curve
    i_max = np.argmax(sensor_data)
    i_min = np.argmin(sensor_data)
    
    return (max(sensor_data) - min(sensor_data)) / (i_max - i_min)

def get_energie_effizienz_klasse(a):
    if a <= 30:
        return '+A'
    elif a <=  50:
        return 'A'
    elif a <= 75:
        return 'B'
    elif a <= 100:
        return 'C'
    elif a <= 130:
        return 'D'
    elif a <= 160:
        return 'E'
    elif a <= 200:
        return 'F'
    elif a <= 250:
        return 'G'
    else:
        return 'H'
    
def getEnergieeffizienzklasse(sensor_data, V, umfang):
    try: 
        a = get_slope(sensor_data) # °C/s
    except: 
        a = 0.0000036667

    Energy_loss_vol_sec = a * c_air * density_air * V # °C/s * kJ/(kg K) * kg/m3 [kJ/(m3 s)]
    
    Energy_loss_sec_m2 = Energy_loss_vol_sec / umfang
    
    Energy_loss_m2_year = Energy_loss_sec_m2 * 60*60*24*365
    
    # todo: reclassify with table here: https://www.haus.de/geld-recht/energieausweis-23536
    
    return get_energie_effizienz_klasse(Energy_loss_m2_year)

def get_volume(area, raumhohe):
    return area*raumhohe
    
    