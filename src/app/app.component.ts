import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'recipe-app';

  selectedFeature = 'showRecipes'; // or 'showShoppingList'

  onFeatureSelected(feature: string) {
    this.selectedFeature = feature;
    console.log('selected feature', feature);
  }
}
