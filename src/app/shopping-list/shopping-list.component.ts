import {Component, OnInit} from '@angular/core';
import {Ingredient} from '../shared/ingredients.model';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.actions';
import {AppState} from '../store/app.reducer';
import {animate, group, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  animations: [
    trigger('addAndRemoveAnimation', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)'
        }),
        animate(300)
      ]),
      transition('* => void', [
        group([
          animate(500, style({
            color: 'red'
          })),
          animate(1000, style({
            opacity: 0,
            transform: 'translateX(+100px)'
          }))
        ])
      ])
    ])
  ]
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
