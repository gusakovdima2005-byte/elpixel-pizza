import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Menu } from './components/menu/menu';
import { Pizza } from './components/pizza/pizza';
import { Contacts } from './components/contacts/contacts';
import { NotFound } from './components/not-found/not-found';
import { Order } from './components/order/order';
import { Weather } from './components/weather/weather';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'menu', component: Menu },
  { path: 'pizza/:id', component: Pizza },
  { path: 'contacts', component: Contacts },
  { path: 'order', component: Order },
  { path: 'weather', component: Weather },
  { path: '**', component: NotFound },
];
