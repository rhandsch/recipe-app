import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Recipe} from '../recipe.model';
import {RecipeService} from '../recipe.service';
import {NgForm} from '@angular/forms';

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

  onSubmit(f: NgForm) {
    console.log(f);
    console.log('valid:', f.valid, 'dirty:', f.dirty);
    console.log('value:', f.value);

    if (f.valid) {
      this.recipe.name = f.value.name;
      this.recipe.description = f.value.description;
      this.recipe.imagePath = f.value.imagePath;
    }
  }

  onReset(f: NgForm) {
    f.reset(this.recipe);
  }
}
