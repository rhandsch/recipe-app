import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Recipe} from '../recipe.model';
import {RecipeService} from '../recipe.service';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Ingredient} from '../../shared/ingredients.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private recipeService: RecipeService, private router: Router) {
  }

  get ingredientControls() {
    return (this.form.get('ingredients') as FormArray).controls;
  }

  recipeIndex: number;
  editMode = false;
  recipe: Recipe;
  form: FormGroup;

  private static createIngredientFormGroup(ingredient: Ingredient) {
    return new FormGroup({
      name: new FormControl(ingredient.name, Validators.required),
      amount: new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    });
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
    this.initForm();
  }

  private initForm() {
    this.form = new FormGroup({
      name: new FormControl(this.recipe.name, Validators.required),
      description: new FormControl(this.recipe.description, Validators.required),
      imagePath: new FormControl(this.recipe.imagePath, Validators.required),
      ingredients: new FormArray(this.recipe.ingredients.map(ingredient => RecipeEditComponent.createIngredientFormGroup(ingredient)))
    });
  }

  onSubmit(recipe: Recipe) {
    console.log(this.form);
    console.log('valid:', this.form.valid, 'dirty:', this.form.dirty);
    console.log('value:', this.form.value);

    if (this.form.valid) {
      this.recipe.name = this.form.value.name;
      this.recipe.description = this.form.value.description;
      this.recipe.imagePath = this.form.value.imagePath;
      if (this.editMode) {
        this.recipeService.updateRecipe(this.recipeIndex, this.form.value);
      } else {
        this.recipeService.saveNewRecipe(this.recipe);
      }
    }
    this.onCancel();
  }

  onReset() {
    this.initForm();
  }

  addIngredient() {
    const ingControls: FormArray = this.form.get('ingredients') as FormArray;
    ingControls.push(RecipeEditComponent.createIngredientFormGroup(new Ingredient('', 1)));
    console.log(this.form);
  }

  onDeleteIngredient(ingredientIndex: number) {
    const ingControls: FormArray = this.form.get('ingredients') as FormArray;
    ingControls.removeAt(ingredientIndex);
  }

  onCancel() {
    this.router.navigate(['..'], {relativeTo: this.activatedRoute});
  }
}
