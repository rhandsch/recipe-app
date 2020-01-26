import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Recipe} from '../recipe.model';
import {RecipeService} from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  recipeIndex: number;
  editMode = false;
  recipe: Recipe;

  constructor(private activatedRoute: ActivatedRoute, private recipeService: RecipeService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.recipeIndex = +params.id;
      this.editMode = params.id != null;
      if (this.editMode) {
        this.recipe = this.recipeService.loadRecipeByIndex(this.recipeIndex);
      } else {
        this.recipe = new Recipe('new', 'new', '', []);
      }
    });
  }

}
