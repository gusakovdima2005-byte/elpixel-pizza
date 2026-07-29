import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherResponse } from '../models/weather.model';

@Service()
export class WeatherService {
  private readonly apiUrl = 'https://api.open-meteo.com/v1/forecast';
  private readonly http = inject(HttpClient);

  public getWeather(lat: number, lon: number): Observable<WeatherResponse> {
    const params = new HttpParams()
      .set('latitude', lat)
      .set('longitude', lon)
      .set('current', 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m')
      .set('hourly', 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m')
      .set('daily', 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum')
      .set('timezone', 'Europe/Minsk')
      .set('wind_speed_unit', 'ms');

    return this.http.get<WeatherResponse>(this.apiUrl, { params });
  }
}
