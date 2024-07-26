export class NumberUtil {
  static round(number: number, precision: number) {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }
}
