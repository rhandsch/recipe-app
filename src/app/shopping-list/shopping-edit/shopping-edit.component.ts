import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ShoppingListService} from '../shopping-list.service';
import {Ingredient} from '../../shared/ingredients.model';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  ingredient: Ingredient = new Ingredient(null, null);
  editMode = false;
  private ingredientSelectedSub: Subscription;

  @ViewChild('form', {static: false}) form: NgForm;

  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit(): void {
    this.ingredientSelectedSub = this.shoppingListService.ingredientSelected.subscribe(selectedIngredient => {
      this.ingredient = selectedIngredient;
      this.editMode = true;
    });
  }

  onSubmit() {
    console.log(this.form);
    this.ingredient.name = this.form.value.name;
    this.ingredient.amount = this.form.value.amount;
    if (!this.editMode) {
      this.shoppingListService.addIngredient(this.ingredient);
    } else {
      this.onClearClicked();
    }
  }

  onDeleteClicked() {
    if (this.editMode) {
      this.shoppingListService.deleteIngredient(this.ingredient);
      this.onClearClicked();
    }
  }

  onClearClicked() {
    this.ingredient = new Ingredient(null, null);
    this.editMode = false;
  }

  ngOnDestroy(): void {
    this.ingredientSelectedSub.unsubscribe();
  }
}
