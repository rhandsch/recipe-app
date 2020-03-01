import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data, Params, Router} from '@angular/router';
import {Recipe} from '../recipe.model';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Ingredient} from '../../shared/ingredients.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';

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

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private store: Store<AppState>) {
  }

  get ingredientControls() {
    return (this.form.get('ingredients') as FormArray).controls;
  }

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
    });
    this.activatedRoute.data.subscribe((data: Data) => {
      if (this.editMode) {
        return this.recipe = data.resolvedRecipe;
      } else {
        this.recipe = new Recipe('', '', '', []);
      }
    });

    this.initForm();
  }

  onSubmit() {
    console.log(this.form);
    console.log('valid:', this.form.valid, 'dirty:', this.form.dirty);
    console.log('value:', this.form.value);

    if (this.form.valid) {
      this.recipe.name = this.form.value.name;
      this.recipe.description = this.form.value.description;
      this.recipe.imagePath = this.form.value.imagePath;
      if (this.editMode) {
        this.store.dispatch(new RecipeActions.UpdateRecipe({index: this.recipeIndex, recipe: this.form.value}));
      } else {
        this.store.dispatch(new RecipeActions.AddRecipe(this.recipe));
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

  private initForm() {
    this.form = new FormGroup({
      name: new FormControl(this.recipe.name, Validators.required),
      description: new FormControl(this.recipe.description, Validators.required),
      imagePath: new FormControl(this.recipe.imagePath, Validators.required),
      ingredients: new FormArray(this.recipe.ingredients.map(ingredient => RecipeEditComponent.createIngredientFormGroup(ingredient)))
    });
  }
}
