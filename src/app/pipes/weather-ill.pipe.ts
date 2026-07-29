import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'weatherIll' })
export class WeatherIllPipe implements PipeTransform {
  public transform(code: number | undefined | null): string {
    if (code === undefined || code === null) return 'cloudy';
    if (code <= 1) return 'sunny';
    if (code <= 3) return code === 2 ? 'cloudy' : 'overcast';
    if (code <= 48) return 'fog';
    if (code <= 55) return 'drizzle';
    if (code <= 65) return 'rain';
    if (code <= 75) return 'snow';
    if (code <= 82) return 'shower';
    return 'storm';
  }
}
