import {NgModule} from '@angular/core';
import {PlaceholderDirective} from './placeholder.directive';
import {AlertComponent} from './alert/alert.component';
import {CommonModule} from '@angular/common';
import {LoadingSpinnerComponent} from './loading-spinner/loading-spinner.component';
import {DropdownDirective} from './dropdown.directive';

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    DropdownDirective,
    PlaceholderDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    DropdownDirective,
    PlaceholderDirective,
    CommonModule
  ],
  entryComponents: [
    AlertComponent
  ]
})

export class SharedModule {
}
