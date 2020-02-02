import {Component, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {RecipeService} from '../recipe.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipeIndex: number;
  recipe: Recipe;

  constructor(private recipeService: RecipeService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.recipeIndex = +params.id;
        this.recipe = this.recipeService.loadRecipeByIndex(this.recipeIndex);
      }
    );

  }

  onSendToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.router.navigate(['/shopping-list']);
  }

  onEdit() {
    this.router.navigate(['edit'], {relativeTo: this.activatedRoute});
  }

  onDelete() {
    this.recipeService.deleteByIndex(this.recipeIndex);
    this.router.navigate(['/recipes']);
  }
}
