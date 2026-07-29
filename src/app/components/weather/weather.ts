import { Component, computed, inject, signal } from '@angular/core';
import { WeatherService } from '../../services/weather';
import { WeatherResponse } from '../../models/weather.model';
import { interval, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { WeatherCodePipe } from '../../pipes/weather-code.pipe';
import { WeatherEmojiPipe } from '../../pipes/weather-emoji.pipe';
import { WeatherIllPipe } from '../../pipes/weather-ill.pipe';

interface City {
  key: string;
  name: string;
  lat: number;
  lon: number;
}

@Component({
  selector: 'app-weather',
  imports: [WeatherCodePipe, WeatherEmojiPipe, WeatherIllPipe],
  templateUrl: './weather.html',
  styleUrl: './weather.css',
})
export class Weather {
  private readonly weatherService = inject(WeatherService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  public readonly weather = signal<WeatherResponse | null>(null);
  public readonly isLoading = signal(false);
  public readonly error = signal<string | null>(null);

  public readonly cities: City[] = [
    { key: 'homel', name: 'Гомель', lat: 52.43, lon: 30.97 },
    { key: 'minsk', name: 'Минск', lat: 53.9, lon: 27.56 },
    { key: 'kalinkavichy', name: 'Калинковичи', lat: 52.13, lon: 29.33 },
    { key: 'mozyr', name: 'Мозырь', lat: 52.05, lon: 29.27 },
  ];

  public readonly activeCity = signal<string>(this.cities[0].key);

  public readonly activeCityName = computed(
    () => this.cities.find((city) => city.key === this.activeCity())?.name ?? '',
  );

  public readonly dailyForecast = computed(() => {
    const daily = this.weather()?.daily;
    if (!daily) return [];
    return daily.time.slice(0, 7).map((date, i) => ({
      day: this.dayNames[new Date(date).getDay()],
      code: daily.weather_code[i],
      tempMax: daily.temperature_2m_max[i],
      tempMin: daily.temperature_2m_min[i],
    }));
  });

  public readonly tomorrow = computed(() => this.dailyForecast()[1] ?? null);

  public readonly hourlyForecast = computed(() => {
    const hourly = this.weather()?.hourly;
    if (!hourly) return [];
    const now = new Date();
    const currentHour = now.getHours();
    const startIdx = hourly.time.findIndex((t) => new Date(t).getHours() >= currentHour);
    if (startIdx === -1) return [];
    return hourly.time.slice(startIdx, startIdx + 8).map((time, i) => {
      const idx = startIdx + i;
      return {
        time: new Date(time).getHours().toString().padStart(2, '0') + ':00',
        temp: hourly.temperature_2m[idx],
        code: hourly.weather_code[idx],
      };
    });
  });

  private subscription: Subscription | null = null;
  private activeCoords = { lat: this.cities[0].lat, lon: this.cities[0].lon };

  constructor() {
    const cityKey = this.route.snapshot.queryParamMap.get('city');
    const city: City = this.cities.find((city) => city.key === cityKey) ?? this.cities[0];
    this.loadWeather(city.lat, city.lon, city.key);

    interval(900_000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        const city = this.cities.find((city) => city.key === this.activeCity());
        if (city) this.loadWeather(city.lat, city.lon, city.key);
      });
  }

  public retry(): void {
    this.loadWeather(this.activeCoords.lat, this.activeCoords.lon, this.activeCity());
  }

  public loadWeather(lat: number, lon: number, cityKey: string): void {
    this.subscription?.unsubscribe();

    this.activeCoords = { lat, lon };
    this.activeCity.set(cityKey);

    this.isLoading.set(true);
    this.weather.set(null);
    this.error.set(null);

    this.subscription = this.weatherService.getWeather(lat, lon).subscribe({
      next: (res) => this.weather.set(res),
      complete: () => this.isLoading.set(false),
      error: () => {
        this.error.set('Ошибка загрузки');
        this.isLoading.set(false);
      },
    });
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { city: cityKey },
      queryParamsHandling: 'merge',
    });
  }
}
