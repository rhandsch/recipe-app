import {Component, OnInit} from '@angular/core';
import {Ingredient} from '../shared/ingredients.model';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.actions';
import {AppState} from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
    console.log('selected ingredients', this.ingredients);
  }

  onIngredientClicked(index: number) {
    this.store.dispatch(ShoppingListActions.startEdit({index}));
  }
}
