import { City } from '../models/weather.model';

export const DAY_NAMES = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export const CITIES: City[] = [
  { key: 'homel', name: 'Гомель', lat: 52.43, lon: 30.97 },
  { key: 'minsk', name: 'Минск', lat: 53.9, lon: 27.56 },
  { key: 'kalinkavichy', name: 'Калинковичи', lat: 52.13, lon: 29.33 },
  { key: 'mozyr', name: 'Мозырь', lat: 52.05, lon: 29.27 },
];

export const REFRESH_INTERVAL = 900_000;
