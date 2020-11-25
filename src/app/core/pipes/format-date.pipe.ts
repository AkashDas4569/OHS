import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
// import 'moment-duration-format';
// interface Duration extends moment.Duration {
//   format: (template?: string, precision?: number, settings?: DurationSettings) => string;
// }
// interface DurationSettings {
//   forceLength: boolean;
//   precision: number;
//   template: string;
//   trim: boolean | 'left' | 'right';
// }
@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: string, args: any): any {
    const UtcOffsetMoment: number = (moment().utcOffset()) * 60;
    if (!args.type || args.type === 'format') {
      const formattedDateTime = moment(value).add(UtcOffsetMoment, 'seconds').format(args.format ? args.format : 'DD/MM/YYYY');
      return formattedDateTime;
    } else if (!args.type || args.type === 'formatFromDate') {
      const formattedDateTime = moment(value, (args.fromDate ? args.fromDate : 'DD/MM/YYYY')).add(UtcOffsetMoment, 'seconds').format(args.format ? args.format : 'DD/MM/YYYY');
      return formattedDateTime;
    } else if (!args.type || args.type === 'formatNoUTC') {
      const formattedDateTime = moment(value).format(args.format ? args.format : 'DD/MM/YYYY');
      return formattedDateTime;
    } else if (args.type === 'formatUnix') {
      const formattedDateTime = moment.unix(+value).format(args.format ? args.format : 'DD/MM/YYYY');
      return formattedDateTime;
    } else if (args.type === 'fromTime') {
      const formattedDateTime = moment(value).add(UtcOffsetMoment, 'seconds').fromNow();
      return formattedDateTime;
    } else if (args.type === 'duration') {
      // const formattedDateTime = moment().startOf('day').seconds(+value).format(args.format ? args.format : 'HH:mm:ss');
      const formattedDateTime = this.secondsToTime(+value, (args.format ? args.format : 'HH:mm:ss'));
      return formattedDateTime;
    } else if (args.type === 'validity') {
      const formattedDateTime = moment()
                                .add((+value - 1), 'd')
                                // .add(UtcOffsetMoment, 'seconds')
                                .format(args.format ? args.format : 'DD/MM/YYYY');
      return formattedDateTime;
    }
  }

  secondsToTime(seconds: number, format: string) {
    // Calculation
    const ms = (seconds * 1000) % 1000;
    seconds = seconds - (ms / 1000);
    const secs = seconds % 60;
    seconds = (seconds - secs) / 60;
    const mins = seconds % 60;
    const hrs = (seconds - mins) / 60;
    // Format
    const formatSplitted = format.split(/[:.]/);
    let formatSplittedMs;
    if (formatSplitted.length > 3) {
      formatSplittedMs = formatSplitted.pop();
    }
    const fullTime = [
      (formatSplitted.includes('HH') ? this.padding(hrs) : ''),
      (formatSplitted.includes('mm') ? this.padding(mins) : ''),
      (formatSplitted.includes('ss') ? this.padding(secs) : ''),
      (formatSplittedMs ? this.padding(ms, formatSplittedMs.length) : '')
    ];
    if (fullTime.filter(item => item).length > 3) {
      return fullTime.filter(item => item).join(':').replace(/:(?=[^:]*$)/, '.');
    } else {
      return fullTime.filter(item => item).join(':');
    }
  }

  // Pad to 2 or 3 digits, default is 2
  padding(n: number, z?: number) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }

}
