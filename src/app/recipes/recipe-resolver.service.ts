import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Recipe} from './recipe.model';
import {RecipeService} from './recipe.service';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class RecipeResolverService implements Resolve<Recipe> {

  constructor(private recipeService: RecipeService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe> | Promise<Recipe> | Recipe {
    const recipeIndex = +route.params.id;
    console.log('resolving recipe #' + recipeIndex);
    return this.recipeService.loadRecipeByIndex(recipeIndex);
  }

}
