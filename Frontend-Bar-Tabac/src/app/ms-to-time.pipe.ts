import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'msToTime',
  standalone: true

})
export class MsToTimePipe implements PipeTransform {
  transform(milliseconds: number): string {
    const heures: number = Math.floor(milliseconds / 3600000);
    const minutes: number = Math.floor((milliseconds % 3600000) / 60000);
    const secondes: number = Math.floor((milliseconds % 60000) / 1000);
    const millisecondes: number = milliseconds % 1000;

    return `${this.pad(heures)}:${this.pad(minutes)}:${this.pad(secondes)}`;
  }

  private pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  private padMs(value: number): string {
    if (value < 10) {
      return `00${value}`;
    } else if (value < 100) {
      return `0${value}`;
    } else {
      return `${value}`;
    }
  }
}