import moment from 'moment';

export class TimestampUtil {
  static getCurrentTimestamp(): string {
    return moment().toISOString();
  }
}
