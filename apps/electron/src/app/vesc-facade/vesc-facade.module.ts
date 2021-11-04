import { Module } from '@nestjs/common';
import { VESCController } from './vesc.controller';
import { VESCModule } from '../vesc/vesc.module';

@Module({
  controllers: [VESCController],
  imports: [
    VESCModule
  ]
})
export class VescFacadeModule {

}
