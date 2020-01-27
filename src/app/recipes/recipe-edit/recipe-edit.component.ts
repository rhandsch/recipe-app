import {Component, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild('f', {static: false}) f: NgForm;

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

  onSubmit() {
    console.log(this.f);
    console.log('valid:', this.f.valid, 'dirty:', this.f.dirty);
    console.log('value:', this.f.value);

    if (this.f.valid) {
      this.recipe.name = this.f.value.name;
      this.recipe.description = this.f.value.description;
      this.recipe.imagePath = this.f.value.imagePath;
    }
  }

  onReset() {
    this.f.reset(this.recipe);
  }
}
