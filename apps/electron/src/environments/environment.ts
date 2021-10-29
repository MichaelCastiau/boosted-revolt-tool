declare const __BUILD_VERSION__: string;

export const environment = {
  production: false,
  version: __BUILD_VERSION__,
  CAN: {
    extendedId: 0x00000040
  }
};
