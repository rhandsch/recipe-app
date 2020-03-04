import {Recipe} from '../recipe.model';
import {Action, createReducer, on} from '@ngrx/store';
import * as RecipesActions from '../store/recipe.actions';

export interface State {
  recipes: Recipe[];
  recipesFetched: boolean;
}

const initialState: State = {
  recipes: [],
  recipesFetched: false
};

export function recipeReducer(recipeState: State | undefined, recipeAction: Action) {
  return createReducer(
    initialState,
    on(RecipesActions.fetchRecipes, state => ({
      ...state,
      recipes: [],
      recipesFetched: false
    })),
    on(RecipesActions.recipesFetched, (state, action) => ({
      ...state,
      recipes: [...action.recipes],
      recipesFetched: true
    })),
    on(RecipesActions.addRecipe,
      (state, action) => ({
        ...state,
        recipes: state.recipes.concat({...action.recipe})
      })),
    on(RecipesActions.updateRecipe,
      (state, action) => ({
        ...state,
        recipes: state.recipes.map((recipe, index) => index === action.index ? {...action.recipe} : recipe)
      })),
    on(RecipesActions.deleteRecipe,
      (state, action) => ({
        ...state,
        recipes: state.recipes.filter((recipe, index) => index !== action.index)
      }))
  )(recipeState, recipeAction);
}
