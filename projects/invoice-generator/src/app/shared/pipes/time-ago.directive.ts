import { Directive } from '@angular/core';
import * as timeago from 'timeago.js';
@Directive({
  selector: '[appTimeAgo]',
})
export class TimeAgoDirective {
  transform(value: Date | undefined | null) {
    if (value == null) return null;
    try {
      return timeago.format(value);
    } catch (error) {
      return null;
    }
  }
}
