export const connect = async (
  onTemperatureUpdate: (temp: number) => void,
  onHumidityUpdate: (humidity: number) => void
) => {
  // @ts-ignore
  const bluetooth = navigator.bluetooth;
  if (!('bluetooth' in navigator)) {
    return;
  }
  try {
    const device = await bluetooth.requestDevice({
      filters: [{ namePrefix: 'SH' }],
      optionalServices: [UUIDs.TempService, UUIDs.HumidityService],
    });
    const deviceServer = await device.gatt.connect();
    console.log('connected successfully:', deviceServer.device);

    // Setup and use temperature.
    const tempService = await deviceServer.getPrimaryService(UUIDs.TempService);
    const tempConfigCharacteristic = await tempService.getCharacteristic(
      UUIDs.TempCharacteristic
    );
    tempConfigCharacteristic.oncharacteristicvaluechanged = (event: {
      target: { value: DataView };
    }) => onTemperatureUpdate(event.target.value.getFloat32(0, true));
    tempConfigCharacteristic.startNotifications();

    // Setup and use humidity.
    const humidityService = await deviceServer.getPrimaryService(
      UUIDs.HumidityService
    );
    const humidityConfigCharacteristic =
      await humidityService.getCharacteristic(UUIDs.HumidityCharacteristic);
    humidityConfigCharacteristic.oncharacteristicvaluechanged = (event: {
      target: { value: DataView };
    }) => onHumidityUpdate(event.target.value.getFloat32(0, true));
    humidityConfigCharacteristic.startNotifications();
  } catch {
    console.error('Could not connect to Bluetooth device.');
  }
};

const UUIDs = {
  TempService: '00002234-b38d-4985-720e-0f993a68ee41',
  TempCharacteristic: '00002235-b38d-4985-720e-0f993a68ee41',
  HumidityService: '00001234-b38d-4985-720e-0f993a68ee41',
  HumidityCharacteristic: '00001235-b38d-4985-720e-0f993a68ee41',
};
