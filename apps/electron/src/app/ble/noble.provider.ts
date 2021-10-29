import { FactoryProvider } from '@nestjs/common';
import * as noble from '@abandonware/noble';

export const provideNobleToken = 'PROVIDE_NOBLE';
export const nobleProvider: FactoryProvider = {
  provide: provideNobleToken,
  useFactory: () => noble
};
