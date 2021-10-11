import {FactoryProvider} from '@nestjs/common';
import * as serial from 'serialport';

export const serialPortToken = "PROVIDE_SERIALPORT";

export const serialPortProvider: FactoryProvider = {
  provide: serialPortToken,
  useFactory: () => serial
}
