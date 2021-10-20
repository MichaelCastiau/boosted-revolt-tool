import { ADCControlType, AppUse, CANBaud, CANMode, CANStatusMode, ShutdownMode } from './datatypes';

export interface IAppData {
  signature: number,
  general: {
    controllerId: number,
    timeoutMs: number,
    timeoutBrakeCurrent: number,
    sendCanStatus: CANStatusMode,
    canStatusRateHz: number,
    canBaudRate: CANBaud,
    pairingDone: boolean,
    permanentUartEnabled: boolean,
    shutdownMode: ShutdownMode,
    canMode: CANMode,
    uavCanEscIndex: number,
    uavCanRawMode: number,
    appToUse: AppUse,
  },
  ppm: {
    controlType,
    maxErpm,
    hyst,
    pulseStart,
    pulseEnd,
    pulseCenter,
    medianFiler,
    safeStart,
    throttleExposure,
    throttleExposureBrake,
    throttleExposureMode,
    rampTimePos,
    rampTimeNeg,
    multiESC,
    tc,
    tcMaxDiff,
    maxERPMForDir,
    smartRevMaxDuty,
    smartRevRampTime,
  },
  adc: {
    controlType: ADCControlType,
    hyst,
    voltageStart,
    voltageEnd,
    voltageCenter,
    voltage2Start,
    voltage2End,
    useFilter,
    safeStart,
    ccButtonInverted,
    revButtonInverted,
    voltageInverted,
    voltage2Inverted,
    throttleExposure,
    throttleExposureBrake,
    throttleExposureMode,
    rampTimePos,
    tampTimeNeg,
    multiESC,
    tc,
    txMaxDiff,
    updateRateHz,
  },
  uart: {
    baudRate,
  },
  chuk: {
    controlType,
    hyst,
    rampTimePos,
    rampTimeNeg,
    stickERPMperSinCC,
    throttleExposure,
    throttleExposureBrake,
    throttleExposureMode,
    multiESC,
    tc,
    txMaxDiff,
    useSmartRev,
    smartRevMaxDuty,
    smartRevRampTime,
  },
  nrf: {
    speed,
    power,
    crcType,
    retryDelay,
    retries,
    channel,
    address: [number, number, number],
    sendCRCAkn,
  },
  balance: {
    kp,
    ki,
    kd,
    Hz,
    fault: {
      pitch,
      roll,
      duty,
      ADC1,
      ADC2,
      delayPitch,
      delayRoll,
      delayDuty,
      delaySwitchHalf,
      delaySwitchFull,
      ADCHalfERPM,
    },
    tiltback: {
      angle,
      speed,
      duty,
      highVoltage,
      lowVoltage,
      constant,
      constantERPM,
    },
    startup: {
      pitchTolerance,
      rollTolerance,
      speed,
    },
    deadZone,
    currentBoost,
    multiESC,
    yaw: {
      kp,
      ki,
      kd,
    },
    roll: {
      steerKp,
      steerERPMKp,
    },
    brakeCurrent,
    yawCurrentClamp,
    setpoint: {
      pitchFilter,
      targetFilter,
      filterClamp,
    },
    kdP1Frequency,
  },
  pas: {
    controlType,
    sensorType,
    currentScaling,
    pedal: {
      rpmStart,
      rpmEnd,
      invertDirection,
    },
    magnets,
    useFilter,
    rampTimePos,
    rampTimeNeg,
    updateRateHz,
  },
  imu: {
    configType,
    mode,
    sampleRateHz,
    accelerationConfidenceDelay,
    mahonyKp,
    mahonyKi,
    magwickBeta,
    rot: {
      roll,
      pitch,
      yaw,
    },
    accelerationOffsets: [number, number, number],
    gyroOffsets: [number, number, number],
    gyroOffsetsCompFact: [number, number, number],
    gyroOffsetCompClamp,
  }
}
