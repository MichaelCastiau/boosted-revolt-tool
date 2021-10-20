import { IAppData } from '../vesc/models/app-data';
import { ICustomVESCConfig } from '../vesc/models/datatypes';

export function deserializeAppData(buffer: Buffer): IAppData {
  let index = -1;
  return {
    signature: buffer.readUInt32BE(++index),
    general: {
      controllerId: buffer.readUInt8(index += 4),
      timeoutMs: buffer.readUInt32BE(++index),
      timeoutBrakeCurrent: buffer.readFloatBE(index += 4),
      sendCanStatus: buffer.readUInt8(index += 4),
      canStatusRateHz: buffer.readUInt16BE(++index),
      canBaudRate: buffer.readUInt8(index += 2),
      pairingDone: buffer.readUInt8(++index) === 1,
      permanentUartEnabled: buffer.readUInt8(++index) === 1,
      shutdownMode: buffer.readUInt8(++index),
      canMode: buffer.readUInt8(++index),
      uavCanEscIndex: buffer.readUInt8(++index),
      uavCanRawMode: buffer.readUInt8(++index),
      appToUse: buffer.readUInt8(++index)
    },
    ppm: {
      controlType: buffer.readUInt8(++index),
      maxErpm: buffer.readFloatBE(++index),
      hyst: buffer.readFloatBE(index += 4),
      pulseStart: buffer.readFloatBE(index += 4),
      pulseEnd: buffer.readFloatBE(index += 4),
      pulseCenter: buffer.readFloatBE(index += 4),
      medianFiler: buffer.readUInt8(index += 4),
      safeStart: buffer.readUInt8(++index),
      throttleExposure: buffer.readFloatBE(++index),
      throttleExposureBrake: buffer.readFloatBE(index += 4),
      throttleExposureMode: buffer.readUInt8(index += 4),
      rampTimePos: buffer.readFloatBE(++index),
      rampTimeNeg: buffer.readFloatBE(index += 4),
      multiESC: buffer.readUInt8(index += 4),
      tc: buffer.readUInt8(++index),
      tcMaxDiff: buffer.readFloatBE(++index),
      maxERPMForDir: buffer.readFloatBE(index += 4),
      smartRevMaxDuty: buffer.readFloatBE(index += 4),
      smartRevRampTime: buffer.readFloatBE(index += 4)
    },
    adc: {
      controlType: buffer.readUInt8(index += 4),
      hyst: buffer.readFloatBE(++index),
      voltageStart: buffer.readFloatBE(index += 4),
      voltageEnd: buffer.readFloatBE(index += 4),
      voltageCenter: buffer.readFloatBE(index += 4),
      voltage2Start: buffer.readFloatBE(index += 4),
      voltage2End: buffer.readFloatBE(index += 4),
      useFilter: buffer.readUInt8(index += 4),
      safeStart: buffer.readUInt8(++index),
      ccButtonInverted: buffer.readUInt8(++index),
      revButtonInverted: buffer.readUInt8(++index),
      voltageInverted: buffer.readUInt8(++index),
      voltage2Inverted: buffer.readUInt8(++index),
      throttleExposure: buffer.readFloatBE(++index),
      throttleExposureBrake: buffer.readFloatBE(index += 4),
      throttleExposureMode: buffer.readUInt8(index += 4),
      rampTimePos: buffer.readFloatBE(++index),
      tampTimeNeg: buffer.readFloatBE(index += 4),
      multiESC: buffer.readUInt8(index += 4),
      tc: buffer.readUInt8(++index),
      txMaxDiff: buffer.readFloatBE(++index),
      updateRateHz: buffer.readUInt16BE(index += 4)
    },
    uart: {
      baudRate: buffer.readUInt32BE(index += 2)
    },
    chuk: {
      controlType: buffer.readUInt8(index += 4),
      hyst: buffer.readFloatBE(++index),
      rampTimePos: buffer.readFloatBE(index += 4),
      rampTimeNeg: buffer.readFloatBE(index += 4),
      stickERPMperSinCC: buffer.readFloatBE(index += 4),
      throttleExposure: buffer.readFloatBE(index += 4),
      throttleExposureBrake: buffer.readFloatBE(index += 4),
      throttleExposureMode: buffer.readUInt8(index += 4),
      multiESC: buffer.readUInt8(++index),
      tc: buffer.readUInt8(++index),
      txMaxDiff: buffer.readFloatBE(++index),
      useSmartRev: buffer.readUInt8(index += 4),
      smartRevMaxDuty: buffer.readFloatBE(++index),
      smartRevRampTime: buffer.readFloatBE(index += 4)
    },
    nrf: {
      speed: buffer.readUInt8(index += 4),
      power: buffer.readUInt8(++index),
      crcType: buffer.readUInt8(++index),
      retryDelay: buffer.readUInt8(++index),
      retries: buffer.readUInt8(++index),
      channel: buffer.readUInt8(++index),
      address: [buffer.readUInt8(++index), buffer.readUInt8(++index), buffer.readUInt8(++index)],
      sendCRCAkn: buffer.readUInt8(++index)
    },
    balance: {
      kp: buffer.readFloatBE(++index),
      ki: buffer.readFloatBE(index += 4),
      kd: buffer.readFloatBE(index += 4),
      Hz: buffer.readUInt16BE(index += 4),
      fault: {
        pitch: buffer.readFloatBE(index += 2),
        roll: buffer.readFloatBE(index += 4),
        duty: buffer.readFloatBE(index += 4),
        ADC1: buffer.readFloatBE(index += 4),
        ADC2: buffer.readFloatBE(index += 4),
        delayPitch: buffer.readUInt16BE(index += 4),
        delayRoll: buffer.readUInt16BE(index += 2),
        delayDuty: buffer.readUInt16BE(index += 2),
        delaySwitchHalf: buffer.readUInt16BE(index += 2),
        delaySwitchFull: buffer.readUInt16BE(index += 2),
        ADCHalfERPM: buffer.readUInt16BE(index += 2)
      },
      tiltback: {
        angle: buffer.readFloatBE(index += 2),
        speed: buffer.readFloatBE(index += 4),
        duty: buffer.readFloatBE(index += 4),
        highVoltage: buffer.readFloatBE(index += 4),
        lowVoltage: buffer.readFloatBE(index += 4),
        constant: buffer.readFloatBE(index += 4),
        constantERPM: buffer.readUInt16BE(index += 4)
      },
      startup: {
        pitchTolerance: buffer.readFloatBE(index += 2),
        rollTolerance: buffer.readFloatBE(index += 4),
        speed: buffer.readFloatBE(index += 4)
      },
      deadZone: buffer.readFloatBE(index += 4),
      currentBoost: buffer.readFloatBE(index += 4),
      multiESC: buffer.readUInt8(index += 4),
      yaw: {
        kp: buffer.readFloatBE(++index),
        ki: buffer.readFloatBE(index += 4),
        kd: buffer.readFloatBE(index += 4)
      },
      roll: {
        steerKp: buffer.readFloatBE(index += 4),
        steerERPMKp: buffer.readFloatBE(index += 4)
      },
      brakeCurrent: buffer.readFloatBE(index += 4),
      yawCurrentClamp: buffer.readFloatBE(index += 4),
      setpoint: {
        pitchFilter: buffer.readFloatBE(index += 4),
        targetFilter: buffer.readFloatBE(index += 4),
        filterClamp: buffer.readFloatBE(index += 4)
      },
      kdP1Frequency: buffer.readUInt16BE(index += 4)
    },
    pas: {
      controlType: buffer.readUInt8(index += 2),
      sensorType: buffer.readUInt8(++index),
      currentScaling: buffer.readUInt16BE(++index),
      pedal: {
        rpmStart: buffer.readUInt16BE(index += 2),
        rpmEnd: buffer.readUInt16BE(index += 2),
        invertDirection: buffer.readUInt8(index += 2)
      },
      magnets: buffer.readUInt8(++index),
      useFilter: buffer.readUInt8(++index),
      rampTimePos: buffer.readUInt16BE(++index),
      rampTimeNeg: buffer.readUInt16BE(index += 2),
      updateRateHz: buffer.readUInt16BE(index += 2)
    },
    imu: {
      configType: buffer.readUInt8(index += 2),
      mode: buffer.readUInt8(++index),
      sampleRateHz: buffer.readUInt16BE(++index),
      accelerationConfidenceDelay: buffer.readFloatBE(index += 2),
      mahonyKp: buffer.readFloatBE(index += 4),
      mahonyKi: buffer.readFloatBE(index += 4),
      magwickBeta: buffer.readFloatBE(index += 4),
      rot: {
        roll: buffer.readFloatBE(index + 4),
        pitch: buffer.readFloatBE(index + 4),
        yaw: buffer.readFloatBE(index + 4)
      },
      accelerationOffsets: [buffer.readFloatBE(index + 4), buffer.readFloatBE(index + 4), buffer.readFloatBE(index + 4)],
      gyroOffsets: [buffer.readFloatBE(index + 4), buffer.readFloatBE(index + 4), buffer.readFloatBE(index + 4)],
      gyroOffsetsCompFact: [buffer.readFloatBE(index + 4), buffer.readFloatBE(index + 4), buffer.readFloatBE(index + 4)],
      gyroOffsetCompClamp: buffer.readFloatBE(index += 4)
    }
  };
}

export function setVescConfig(signature: number, config: ICustomVESCConfig, data: Buffer): Buffer {
  data.writeUInt32BE(signature, 0);
  data.writeUInt8(config.controllerId, 4);
  data.writeUInt8(config.canStatusMode, 13);
  data.writeInt16BE(config.canStatusRateHz, 14);
  data.writeInt8(config.canBaudRate, 16);
  data.writeInt8(config.canMode, 20);
  data.writeInt8(config.appToUse, 23);


  data.writeUInt8(config.adc.controlType, 82);
  data.writeFloatBE(config.adc.minVoltage, 91);
  data.writeFloatBE(config.adc.maxVoltage, 95);
  data.writeFloatBE(config.adc.centerVoltage, 99);
  return data;
}
