import { DateUnit } from '@core/enums';
import moment from 'moment';
import { NumberUtil } from './number.helper';

export class TimestampUtil {
  static getCurrentTimestamp(): Date {
    return moment().utc().toDate();
  }

  static addTime(
    period: number,
    unit: DateUnit,
    date = this.getCurrentTimestamp(),
  ): Date {
    return moment(date).add(period, unit).toDate();
  }

  static convertDateToSecond(date: Date): number {
    return NumberUtil.round(new Date(date).getTime() / 1000, 0);
  }
}
