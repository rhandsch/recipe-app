import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  private storeSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.storeSub = this.store.select('recipe').subscribe(recipeState => this.recipes = recipeState.recipes);
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }

}
