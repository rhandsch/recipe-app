import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Recipe} from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  recipes: Recipe[] = [
    new Recipe('Schnitzel', 'Ein Wienerschnitzel',
      'https://ais.kochbar.de/kbrezept/72500_32274/620x465/original-wiener-schnitzel-kalbsschnitzel-rezept.jpg'),
    new Recipe('Schweinsbraten', 'Ein Schweinsbraten',
      'https://www.gusto.at/_storage/asset/5724535/storage/womanat:slideshow-large/file/152521305/r_6634.jpg')
  ];

  @Output() recipeClickedInListComp = new EventEmitter<Recipe>();

  constructor() {
  }

  ngOnInit() {
  }

  onRecipeClicked(recipe: Recipe) {
    this.recipeClickedInListComp.emit(recipe);
  }

}
