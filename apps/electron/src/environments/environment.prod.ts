declare const __BUILD_VERSION__: string;

export const environment = {
  production: true,
  version: __BUILD_VERSION__,
  CAN: {
    extendedId: 0x00000040
  },
  BLE: {
    service: {
      uuid: '6E400001-B5A3-F393-E0A9-E50E24DCCA9E',
      characteristics: {
        rx: '6E400002-B5A3-F393-E0A9-E50E24DCCA9E',
        tx: '6E400003-B5A3-F393-E0A9-E50E24DCCA9E'
      }
    }
  }
};
