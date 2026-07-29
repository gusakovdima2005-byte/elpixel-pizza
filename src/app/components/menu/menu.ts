import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  public readonly pizzas = signal([
    { id: 1, name: 'Маргарита', price: 450 },
    { id: 2, name: 'Пепперони', price: 550 },
    { id: 3, name: 'Четыре сыра', price: 600 },
  ]);
}
