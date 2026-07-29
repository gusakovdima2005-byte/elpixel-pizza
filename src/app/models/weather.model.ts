export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;

  current_units?: CurrentUnits;
  current?: CurrentWeather;

  hourly_units?: HourlyUnits;
  hourly?: HourlyData;

  daily_units?: DailyUnits;
  daily?: DailyData;
}

export interface CurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  weather_code: string;
  wind_speed_10m: string;
}

export interface CurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface HourlyUnits {
  time: string;
  temperature_2m: string;
  precipitation_probability: string;
  weather_code: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
}

export interface HourlyData {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
  weather_code: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
}

export interface DailyUnits {
  time: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  precipitation_sum: string;
  weather_code: string;
}

export interface DailyData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  weather_code: number[];
}
