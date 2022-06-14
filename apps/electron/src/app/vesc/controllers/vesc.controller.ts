import { Body, Controller, Get, Post } from '@nestjs/common';
import { VESCService } from '../services/vesc.service';
import { CanMessageDto, MetricSystemDto } from '../dto/can-message.dto';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IAppData } from '../models/app-data';
import { WheelCircumferenceDto } from '../dto/wheel-circumference.dto';
import { PIDDto } from '../dto/pid.dto';
import {
  CAN_CMD_PID_SET_KD,
  CAN_CMD_PID_SET_KI,
  CAN_CMD_PID_SET_KP,
  CAN_CMD_SET_BATT_SERIES,
  CAN_CMD_SET_KMH,
  CAN_CMD_SET_MPH,
  CAN_CMD_SET_USE_ADC_THROTTLE,
  CAN_CMD_SET_USE_CURRENT_CONTROL,
  CAN_CMD_SET_WHEEL_CIRCUMFERENCE
} from '@shared/types';

@Controller('vesc')
export class VESCController {
  constructor(private vesc: VESCService) {
  }

  @Get('app-settings')
  getAppSettings() {
    return this.vesc.getAppSettings();
  }

  @Post('battery')
  forwardCANMessage(@Body() body: CanMessageDto) {
    return this.vesc.forwardCANMessage({
      extendedId: environment.CAN.extendedId,
      data: Buffer.from([CAN_CMD_SET_BATT_SERIES, body.configuration])
    });
  }

  @Post('metric-system')
  setMetricSystem(@Body() body: MetricSystemDto) {
    return this.vesc.forwardCANMessage({
      extendedId: environment.CAN.extendedId,
      data: Buffer.from([body.system === 'kmh' ? CAN_CMD_SET_KMH : CAN_CMD_SET_MPH])
    });
  }

  @Post('wheel-circumference')
  setWheelCircumference(@Body() body: WheelCircumferenceDto) {
    const circumference = body.circumference;
    return this.vesc.forwardCANMessage({
      extendedId: environment.CAN.extendedId,
      data: Buffer.from([
        CAN_CMD_SET_WHEEL_CIRCUMFERENCE,
        (circumference >> 24) & 0xff,
        (circumference >> 16) & 0xff,
        (circumference >> 8) & 0xff,
        (circumference) & 0xff
      ])
    });
  }

  @Post('use-adc-throttle')
  setUseADCThrottle(@Body() body: { useADCThrottle: boolean }) {
    return this.vesc.forwardCANMessage({
      extendedId: environment.CAN.extendedId,
      data: Buffer.from([
        CAN_CMD_SET_USE_ADC_THROTTLE,
        body.useADCThrottle === true ? 1 : 0
      ])
    });
  }

  @Post('use-current-control')
  setUseCurrentControl(@Body() body: { useCurrentControl: boolean }) {
    return this.vesc.forwardCANMessage({
      extendedId: environment.CAN.extendedId,
      data: Buffer.from([
        CAN_CMD_SET_USE_CURRENT_CONTROL,
        body.useCurrentControl === true ? 1 : 0
      ])
    });
  }

  @Post('pid')
  setPIDParameters(@Body() { pid }: PIDDto) {
    return this.vesc.forwardCANMessage({
      extendedId: environment.CAN.extendedId,
      data: Buffer.from([
        CAN_CMD_PID_SET_KP,
        (pid.kp >> 24) & 0xff,
        (pid.kp >> 16) & 0xff,
        (pid.kp >> 8) & 0xff,
        (pid.kp) & 0xff
      ])
    }).then(() => this.vesc.forwardCANMessage({
      extendedId: environment.CAN.extendedId,
      data: Buffer.from([
        CAN_CMD_PID_SET_KI,
        (pid.ki >> 24) & 0xff,
        (pid.ki >> 16) & 0xff,
        (pid.ki >> 8) & 0xff,
        (pid.ki) & 0xff
      ])
    })).then(() => this.vesc.forwardCANMessage({
      extendedId: environment.CAN.extendedId,
      data: Buffer.from([
        CAN_CMD_PID_SET_KD,
        (pid.kd >> 24) & 0xff,
        (pid.kd >> 16) & 0xff,
        (pid.kd >> 8) & 0xff,
        (pid.kd) & 0xff
      ])
    }));
  }

  @Post('/configure')
  configureAutomatically(): Observable<IAppData> {
    return this.vesc.configureForDashboard();
  }
}
