import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pizza',
  imports: [RouterLink],
  templateUrl: './pizza.html',
  styleUrl: './pizza.css',
})
export class Pizza {
  public readonly pizzaId = input<string | null>(null, { alias: 'id' });
}
