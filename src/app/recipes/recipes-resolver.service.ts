import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Recipe} from './recipe.model';
import {RecipeService} from './recipe.service';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {

  private recipesFetched = false;

  constructor(private recipeService: RecipeService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
    if (this.recipesFetched) {
      console.log('resolving recipes');
      return this.recipeService.getRecipes();
    } else {
      console.log('fetching recipes');
      this.recipesFetched = true;
      return this.recipeService.fetchRecipes();
    }
  }

}
