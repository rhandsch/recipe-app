import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AlertComponent} from '../shared/alert/alert.component';
import {PlaceholderDirective} from '../shared/placeholder.directive';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) placeholder;
  private closeSub: Subscription;
  private storeSub: Subscription;

  constructor(private store: Store<fromApp.AppState>,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }
    const email = authForm.value.email;
    const password = authForm.value.password;

    this.store.dispatch(this.isLoginMode
      ? AuthActions.loginStart({email, password})
      : AuthActions.signupStart({email, password}));

    authForm.reset();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onAcceptError() {
    this.store.dispatch(AuthActions.clearError());
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

  private showErrorAlert(errorMessage: string) {
    const cfr = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const placeholderRef = this.placeholder.viewContainerRef;
    placeholderRef.clear();

    const componentRef = placeholderRef.createComponent(cfr);
    componentRef.instance.message = errorMessage;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      placeholderRef.clear();
      this.onAcceptError();
    });
  }

}
