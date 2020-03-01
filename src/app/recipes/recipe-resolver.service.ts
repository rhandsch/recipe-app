import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Recipe} from './recipe.model';
import {Observable, of} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../store/app.reducer';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {Actions, ofType} from '@ngrx/effects';
import * as RecipeActions from './store/recipe.actions';

@Injectable({providedIn: 'root'})
export class RecipeResolverService implements Resolve<Recipe> {

  constructor(private store: Store<AppState>, private actions$: Actions) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe> | Promise<Recipe> | Recipe {
    const recipeIndex = +route.params.id;
    console.log('resolving recipe #' + recipeIndex);
    return this.store.select('recipe').pipe(
      take(1),
      switchMap(recipeState => {
        if (recipeState.recipesFetched) {
          return of(recipeState.recipes);
        } else {
          // Recipes not yet fetched -> wait for fetched action.
          console.log('  recipes not yet fetched -> fetching and waiting for RECIPES_FETCHED');
          this.store.dispatch(new RecipeActions.FetchRecipes());
          return this.actions$.pipe(
            ofType(RecipeActions.RECIPES_FETCHED),
            take(1),
            map((recipeFetched: RecipeActions.RecipesFetched) => recipeFetched.payload)
          );
        }
      }),
      map(recipes => recipes.find((r, i) => i === recipeIndex)),
      tap(recipe => console.log('  found recipe', recipe))
    );
  }

}
