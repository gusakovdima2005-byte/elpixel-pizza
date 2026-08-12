import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'weatherCode' })
export class WeatherCodePipe implements PipeTransform {
  public transform(code: number | undefined | null): string {
    if (code === undefined || code === null) return '--';
    if (code <= 1) return 'Ясно';
    if (code <= 3) return code === 2 ? 'Облачно' : 'Пасмурно';
    if (code <= 48) return 'Туман';
    if (code <= 55) return 'Морось';
    if (code <= 65) return 'Дождь';
    if (code <= 75) return 'Снег';
    if (code <= 82) return 'Ливень';
    return 'Гроза';
  }
}
