import { DateUnit } from '@core/enums';
import moment from 'moment';
import { NumberUtil } from './number.helper';

interface IStartEndOfDate {
  start: Date;
  end: Date;
}

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

  static startOfDate(date: Date): Date {
    return moment(date).startOf(DateUnit.Day).toDate();
  }

  static endOfDate(date: Date): Date {
    return moment(date).endOf(DateUnit.Day).toDate();
  }

  static getStartAndEndOfDate(date: Date): IStartEndOfDate {
    return {
      start: moment(date).startOf(DateUnit.Day).toDate(),
      end: moment(date).endOf(DateUnit.Day).toDate(),
    };
  }
}
