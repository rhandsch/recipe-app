import {Component, OnInit} from '@angular/core';
import {Ingredient} from '../shared/ingredients.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  ingredients: Ingredient[] = [
    new Ingredient('Äpfel', 2),
    new Ingredient('Zitronen', 1.5)
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
