import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'weatherEmoji' })
export class WeatherEmojiPipe implements PipeTransform {
  public transform(code: number | undefined | null): string {
    if (code === undefined || code === null) return '❓';
    if (code <= 1) return '☀️ ';
    if (code <= 3) return code === 2 ? '⛅' : '☁️ ';
    if (code <= 48) return '🌫️';
    if (code <= 55) return '🌦️';
    if (code <= 65) return '🌧️';
    if (code <= 75) return '🌨️';
    if (code <= 82) return '🌧️ ';
    return '⛈️';
  }
}
