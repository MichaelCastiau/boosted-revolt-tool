declare const __BUILD_VERSION__: string;

export const environment = {
  production: false,
  version: __BUILD_VERSION__,
  CAN: {
    extendedId: 0x00000040
  },
  BLE: {
    service: {
      uuid: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
      characteristics: {
        rx: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
        tx: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
      }
    }
  }
};
