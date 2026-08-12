import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { WeatherService } from '../../services/weather';
import { WeatherResponse, City } from '../../models/weather.model';
import { distinctUntilChanged, interval, Subscription, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { WeatherCodePipe } from '../../pipes/weather-code.pipe';
import { WeatherEmojiPipe } from '../../pipes/weather-emoji.pipe';
import { WeatherIllPipe } from '../../pipes/weather-ill.pipe';
import { CITIES, DAY_NAMES, REFRESH_INTERVAL } from '../../constants/weather.constants';

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
  private readonly destroyRef = inject(DestroyRef);

  public readonly weather = signal<WeatherResponse | null>(null);
  public readonly isLoading = signal(false);
  public readonly error = signal<string | null>(null);

  public readonly cities: City[] = CITIES;

  public readonly activeCityKey = signal<string>(CITIES[0].key);

  public readonly currentCity = computed(
    () => CITIES.find((city) => city.key === this.activeCityKey()) ?? CITIES[0],
  );

  public readonly activeCityName = computed(() => this.currentCity().name);

  public readonly dailyForecast = computed(() => {
    const daily = this.weather()?.daily;
    if (!daily) return [];
    return daily.time.slice(0, 7).map((date, i) => ({
      day: DAY_NAMES[this.parseLocalDate(date).getDay()],
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

  private weatherSubscription: Subscription | null = null;

  constructor() {
    this.route.queryParams
      .pipe(
        map((params) => params['city'] ?? CITIES[0].key),
        distinctUntilChanged(),
        map((key: string) => CITIES.find((city) => city.key === key) ?? CITIES[0]),
        takeUntilDestroyed(),
      )
      .subscribe((city) => this.loadWeather(city));

    interval(REFRESH_INTERVAL)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.refreshSilently());
  }

  public selectCity(city: City): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { city: city.key },
      queryParamsHandling: 'merge',
    });
  }

  public retry(): void {
    this.loadWeather(this.currentCity());
  }

  public loadWeather(city: City): void {
    this.weatherSubscription?.unsubscribe();

    this.activeCityKey.set(city.key);

    this.isLoading.set(true);
    this.weather.set(null);
    this.error.set(null);

    this.weatherSubscription = this.weatherService
      .getWeather(city.lat, city.lon)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.weather.set(res),
        complete: () => this.isLoading.set(false),
        error: () => {
          this.error.set('Ошибка загрузки');
          this.isLoading.set(false);
        },
      });
  }

  private refreshSilently(): void {
    this.weatherService
      .getWeather(this.currentCity().lat, this.currentCity().lon)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.weather.set(res),
      });
  }

  private parseLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}
