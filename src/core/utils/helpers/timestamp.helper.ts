import moment from 'moment';

export class TimestampUtil {
  static getCurrentTimestamp(): Date {
    return moment().toDate();
  }
}
