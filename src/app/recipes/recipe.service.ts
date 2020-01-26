import {Recipe} from './recipe.model';
import {EventEmitter, Injectable, Output} from '@angular/core';
import {Ingredient} from '../shared/ingredients.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {

  private recipes: Recipe[] = [
    new Recipe('Schnitzel', 'Ein Wienerschnitzel',
      'https://ais.kochbar.de/kbrezept/72500_32274/620x465/original-wiener-schnitzel-kalbsschnitzel-rezept.jpg',
      [
        new Ingredient('Kalbfleisch', 1),
        new Ingredient('Brösel', 2)]),
    new Recipe('Schweinsbraten', 'Ein Schweinsbraten',
      'https://www.gusto.at/_storage/asset/5724535/storage/womanat:slideshow-large/file/152521305/r_6634.jpg',
      [
        new Ingredient('Schweinefleisch', 1),
        new Ingredient('Knoblauch', 3)])
  ];

  @Output() recipeSelected = new EventEmitter<Recipe>();

  constructor(private shoppingListService: ShoppingListService) {
  }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  onRecipeSelected(recipe: Recipe) {
    console.log('onRecipeSelected:', recipe);
    this.recipeSelected.emit(recipe);
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  loadRecipeByIndex(index: number) {
    return this.recipes[index];
  }
}
