import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/ingredients.model';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import {AppState} from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('form', {static: false})
  form: NgForm;

  editMode = false;
  ingredient: Ingredient = new Ingredient(null, null);
  private subscription: Subscription;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(state => {
      if (state.editIndex > -1) {
        this.editMode = true;
        this.ingredient = state.ingredients[state.editIndex];
      } else {
        this.editMode = false;
        this.ingredient = new Ingredient(null, null);
      }
    });
  }

  onSubmit() {
    console.log(this.form);
    this.ingredient.name = this.form.value.name;
    this.ingredient.amount = this.form.value.amount;
    if (!this.editMode) {
      this.store.dispatch(ShoppingListActions.addIngredient({ingredient: this.ingredient}));
    } else {
      this.store.dispatch(ShoppingListActions.updateIngredient({ingredient: this.ingredient}));
      // this.onClearClicked();
      this.form.reset();
    }
  }

  onDeleteClicked() {
    if (this.editMode) {
      this.store.dispatch(ShoppingListActions.deleteIngredient());
      this.onClearClicked();
    }
  }

  onClearClicked() {
    this.ingredient = new Ingredient(null, null);
    this.editMode = false;
    this.store.dispatch(ShoppingListActions.stopEdit());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(ShoppingListActions.stopEdit());
  }
}
