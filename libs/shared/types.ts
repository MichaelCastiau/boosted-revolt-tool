export type ConnectionMethod = 'usb' | 'ble';
export type PIDParameter = {
  kp: number;
  ki: number;
  kd: number;
}
export const CAN_CMD_SET_MPH = 0x01;
export const CAN_CMD_SET_KMH = 0x02;
export const CAN_CMD_EX_BOOTLOADER = 0x03;
export const CAN_CMD_SET_BATT_SERIES = 0x04;
export const CAN_CMD_SET_WHEEL_CIRCUMFERENCE = 0x05;
export const CAN_CMD_SET_LUX_THRESHOLD = 0x06;
export const CAN_CMD_SET_USE_ADC_THROTTLE = 0x07;
export const CAN_CMD_SET_USE_CURRENT_CONTROL = 0x08;
export const CAN_CMD_PID_SET_KP = 0x09;
export const CAN_CMD_PID_SET_KI = 0x0a;
export const CAN_CMD_PID_SET_KD = 0x0b;
