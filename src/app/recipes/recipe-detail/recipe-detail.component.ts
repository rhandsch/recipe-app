import {Component, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {ActivatedRoute, Data, Params, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipeIndex: number;
  recipe: Recipe;

  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.recipeIndex = +params.id;
    });
    this.activatedRoute.data.subscribe((data: Data) => {
      console.log('got recipe ', data.resolvedRecipe);
      return this.recipe = data.resolvedRecipe;
    });
  }

  onSendToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
    this.router.navigate(['/shopping-list']);
  }

  onEdit() {
    this.router.navigate(['edit'], {relativeTo: this.activatedRoute});
  }

  onDelete() {
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.recipeIndex));
    this.router.navigate(['/recipes']);
  }
}
