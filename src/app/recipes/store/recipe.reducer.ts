import {Recipe} from '../recipe.model';
import * as RecipeActions from './recipe.actions';
import {ADD_RECIPE, DELETE_RECIPE, FETCH_RECIPES, RECIPES_FETCHED, UPDATE_RECIPE} from './recipe.actions';

export interface State {
  recipes: Recipe[];
  recipesFetched: boolean;
}

const initialState: State = {
  recipes: [],
  recipesFetched: false
};

export function recipeReducer(state: State = initialState, action: RecipeActions.RecipeActions) {
  switch (action.type) {
    case FETCH_RECIPES:
      return {
        ...state,
        recipes: [],
        recipesFetched: false
      };
    case RECIPES_FETCHED:
      return {
        ...state,
        recipes: action.payload,
        recipesFetched: true
      };
    case DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, index) => index !== action.payload)
      };
    case UPDATE_RECIPE:
      const updatedRecipe = {
        ...state.recipes[action.payload.index],
        ...action.payload.recipe
      };
      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payload.index] = updatedRecipe;
      return {
        ...state,
        recipes: updatedRecipes
      };
    case ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };
    default:
      return state;
  }
}
