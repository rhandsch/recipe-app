import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as RecipeActions from './recipe.actions';
import {map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Recipe} from '../recipe.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app.reducer';

const FIREBASE_RECIPES_URL = 'https://rob-learng.firebaseio.com/recipes';
const FIREBASE_URL_POSTFIX = '.json';

@Injectable()
export class RecipeEffects {

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipeActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http
        .get<Recipe[]>(FIREBASE_RECIPES_URL + FIREBASE_URL_POSTFIX)
        .pipe(
          map(recipes =>
            recipes.map(recipe => {
              // initialize ingredients to an empty array if not existing
              return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
            })),
          map(recipes => {
              console.log('fetched ' + recipes.length + ' recipes');
              return new RecipeActions.RecipesFetched(recipes);
            }
          )
        );
    })
  );

  @Effect()
  saveRecipes = this.actions$.pipe(
    ofType(RecipeActions.SAVE_RECIPES),
    withLatestFrom(this.store.select('recipe')),
    switchMap(([actionData, recipeState]) => {
      return this.http
        .put<{ name: string }>(FIREBASE_RECIPES_URL + FIREBASE_URL_POSTFIX, recipeState.recipes)
        .pipe(
          tap(responseData => console.log(responseData)),
          map(responseData => new RecipeActions.RecipesSaved()));
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<AppState>) {
  }
}

