import {Recipe} from './recipe.model';
import {Injectable} from '@angular/core';
import {Ingredient} from '../shared/ingredients.model';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import {AppState} from '../store/app.reducer';

@Injectable({providedIn: 'root'})
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();

  private readonly firebaseRecipesUrl = 'https://rob-learng.firebaseio.com/recipes';
  private readonly firebaseUrlPostfix = '.json';

  private recipes: Recipe[] = [
    // new Recipe('Schnitzel', 'Ein Wienerschnitzel',
    //   'https://ais.kochbar.de/kbrezept/72500_32274/620x465/original-wiener-schnitzel-kalbsschnitzel-rezept.jpg',
    //   [
    //     new Ingredient('Kalbfleisch', 1),
    //     new Ingredient('Brösel', 2)]),
    // new Recipe('Schweinsbraten', 'Ein Schweinsbraten',
    //   'https://www.gusto.at/_storage/asset/5724535/storage/womanat:slideshow-large/file/152521305/r_6634.jpg',
    //   [
    //     new Ingredient('Schweinefleisch', 1),
    //     new Ingredient('Knoblauch', 3)])
  ];
  private recipesFetched = false;

  constructor(private http: HttpClient,
              private store: Store<AppState>) {
    store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        if (user) {
          this.fetchRecipes().subscribe();
        }
      });
  }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  loadRecipeByIndex(index: number) {
    if (!this.recipesFetched) {
      console.log('recipes not yet fetched');
      const promise = new Promise<Recipe>(resolve => {
        this.recipesChanged.subscribe(recipes => {
          console.log('got recipesChanged, loading recipe #' + index);
          resolve(recipes[index]);
        });
      });
      return promise;
    }

    console.log('loading recipe #' + index);
    return this.recipes[index];
  }

  saveNewRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    console.log('added new', recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    console.log('updated #' + index, recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteByIndex(index: number) {
    this.recipes.splice(index, 1);
    console.log('deleted #' + index);
    this.recipesChanged.next(this.recipes.slice());
  }

  saveRecipes() {
    this.http.put<{ name: string }>(this.firebaseRecipesUrl + this.firebaseUrlPostfix, this.recipes)
      .subscribe(responseData => console.log(responseData));
  }

  fetchRecipes() {
    console.log('start fetching recipes');
    return this.http
      .get<Recipe[]>(this.firebaseRecipesUrl + this.firebaseUrlPostfix)
      .pipe(
        map(recipes =>
          recipes.map(recipe => {
            // initialize ingredients to an empty array if not existing
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
          })),
        tap(recipes => {
            console.log('fetched ' + recipes.length + ' recipes');
            this.recipes = recipes;
            this.recipesFetched = true;
            this.recipesChanged.next(this.recipes.slice());
          }
        )
      );
  }
}
