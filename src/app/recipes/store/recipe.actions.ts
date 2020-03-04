import {createAction, props} from '@ngrx/store';
import {Recipe} from '../recipe.model';

export const fetchRecipes = createAction('[Recipe] Fetch Recipes');
export const recipesFetched = createAction('[Recipe] Recipes Fetched', props<{ recipes: Recipe[] }>());
export const storeRecipes = createAction('[Recipe] Store Recipes');
export const recipesStored = createAction('[Recipe] Recipes Stored');
export const addRecipe = createAction('[Recipe] Add Recipe', props<{ recipe: Recipe }>());
export const updateRecipe = createAction('[Recipe] Update Recipe', props<{ index: number, recipe: Recipe }>());
export const deleteRecipe = createAction('[Recipe] Delete Recipe', props<{ index: number }>());
