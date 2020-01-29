import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Recipe} from '../recipe.model';
import {RecipeService} from '../recipe.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  recipeIndex: number;
  editMode = false;
  recipe: Recipe;
  form: FormGroup;

  constructor(private activatedRoute: ActivatedRoute, private recipeService: RecipeService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.recipeIndex = +params.id;
      this.editMode = params.id != null;
      if (this.editMode) {
        this.recipe = this.recipeService.loadRecipeByIndex(this.recipeIndex);
      } else {
        this.recipe = new Recipe('', '', '', []);
      }
    });

    this.form = new FormGroup({
      name: new FormControl(this.recipe.name, Validators.required),
      description: new FormControl(this.recipe.description, Validators.required),
      imagePath: new FormControl(this.recipe.imagePath)
    });
  }

  onSubmit() {
    console.log(this.form);
    console.log('valid:', this.form.valid, 'dirty:', this.form.dirty);
    console.log('value:', this.form.value);

    if (this.form.valid) {
      this.recipe.name = this.form.value.name;
      this.recipe.description = this.form.value.description;
      this.recipe.imagePath = this.form.value.imagePath;
      if (!this.editMode) {
        this.recipeService.saveNewRecipe(this.recipe);
        console.log('saved new ', this.recipe);
      }
    }
  }

  onReset() {
    this.form.reset(this.recipe);
  }
}
