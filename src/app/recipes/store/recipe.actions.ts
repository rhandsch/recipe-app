import {Action} from '@ngrx/store';
import {Recipe} from '../recipe.model';

export const FETCH_RECIPES = '[Recipe] Fetch Recipes';
export const RECIPES_FETCHED = '[Recipe] Recipes Fetched';
export const SAVE_RECIPES = '[Recipe] Save Recipes';
export const RECIPES_SAVED = '[Recipe] Recipes Saved';
export const DELETE_RECIPE = '[Recipe] Delete Recipe';
export const UPDATE_RECIPE = '[Recipe] Update Recipe';
export const ADD_RECIPE = '[Recipe] Save Recipe';

export class FetchRecipes implements Action {
  readonly type = FETCH_RECIPES;
}

export class RecipesFetched implements Action {
  readonly type = RECIPES_FETCHED;

  constructor(public payload: Recipe[]) {
  }
}

export class SaveRecipes implements Action {
  readonly type = SAVE_RECIPES;
}

export class RecipesSaved implements Action {
  readonly type = RECIPES_SAVED;
}

export class DeleteRecipe implements Action {
  readonly type = DELETE_RECIPE;

  constructor(public payload: number) {
  }
}

export class UpdateRecipe implements Action {
  readonly type = UPDATE_RECIPE;

  constructor(public payload: { index: number, recipe: Recipe }) {
  }
}

export class AddRecipe implements Action {
  readonly type = ADD_RECIPE;

  constructor(public payload: Recipe) {
  }
}

export type RecipeActions = FetchRecipes | RecipesFetched | SaveRecipes | RecipesSaved | DeleteRecipe | UpdateRecipe | AddRecipe;
