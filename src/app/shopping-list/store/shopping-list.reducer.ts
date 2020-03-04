import {Ingredient} from '../../shared/ingredients.model';
import {Action, createReducer, on} from '@ngrx/store';
import * as ShoppingListActions from './shopping-list.actions';

// export interface State {
//   ingredients: Ingredient[];
//   editedIngredient: Ingredient;
//   editedIngredientIndex: number;
// }
// const initialState: State = {
//   ingredients: [
//     new Ingredient('Äpfel', 2),
//     new Ingredient('Zitronen', 1.5)
//   ],
//   editedIngredient: null,
//   editedIngredientIndex: -1
// };

export interface State {
  ingredients: Ingredient[];
  editIndex: number;
}

const initialState: State = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ],
  editIndex: -1
};

export function shoppingListReducer(shoppingListState: State | undefined, shoppingListAction: Action) {
  return createReducer(
    initialState,
    on(ShoppingListActions.addIngredient, (state, action) => ({...state, ingredients: state.ingredients.concat(action.ingredient)})),
    on(ShoppingListActions.addIngredients, (state, action) => ({...state, ingredients: state.ingredients.concat(...action.ingredients)})),
    on(ShoppingListActions.updateIngredient, (state, action) => ({
      ...state,
      editIndex: -1,
      ingredients: state.ingredients.map((ingredient, index) => index === state.editIndex ? {...action.ingredient} : ingredient)
    })),
    on(ShoppingListActions.deleteIngredient, state => ({
      ...state,
      editIndex: -1,
      ingredients: state.ingredients.filter((ingredient, index) => index !== state.editIndex)
    })),
    on(ShoppingListActions.startEdit, (state, action) => ({...state, editIndex: action.index})),
    on(ShoppingListActions.stopEdit, state => ({...state, editIndex: -1}))
  )(shoppingListState, shoppingListAction);
}

/*
export function shoppinglistReducer(state: State = initialState, action: ShoppingListActions.ShoppingListActions) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };
    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[state.editedIngredientIndex];
      const updatedIngredient = {...ingredient, ...action.payload};
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ig, index) => index !== state.editedIngredientIndex),
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    case ShoppingListActions.START_EDIT_INGREDIENT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: {...state.ingredients[action.payload]}
      };
    case ShoppingListActions.STOP_EDIT_INGREDIENT:
      return {
        ...state,
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    default:
      return state;
  }

}
*/
