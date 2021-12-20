import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CommonModule } from '@angular/common';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { Store, StoreModule } from '@ngrx/store';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from '@auth0/auth0-angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { environment as env, environment } from '../environments/environment';
import { LogService } from './services/log.service';
import { AuthServiceService } from './auth/auth-service.service';
import { LoginModule } from './auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertmodalComponent } from './shared/alertmodal/alertmodal.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxStripeModule } from 'ngx-stripe';
import { AuthState } from './auth/store/auth.reducer';
import { checkAuth } from './auth/store/auth.actions';
import { ScullyLibModule } from '@scullyio/ng-lib';
@NgModule({
  declarations: [AppComponent, PageNotFoundComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,

    StoreModule.forRoot([], {
      runtimeChecks: {
        strictActionImmutability: true,
        strictActionSerializability: true,
        strictStateImmutability: true,
        strictStateSerializability: true,
        strictActionTypeUniqueness: true,
      },
    }),

    InfiniteScrollModule,
    LoginModule,
    ScullyLibModule,
    // StoreRouterConnectingMoule.forRoot(),
    EffectsModule.forRoot([]),
    AuthModule.forRoot({
      ...env.auth,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
  ],
  bootstrap: [AppComponent],
  exports: [
    // NgxStripeModule
  ],
  entryComponents: [AlertmodalComponent],
  providers: [
    LogService,
    AuthServiceService,
    {
      provide: APP_INITIALIZER,
      useFactory: (store: Store<AuthState>) => {
        return () => {
          store.dispatch(checkAuth());
        };
      },
      multi: true,
      deps: [Store],
    },
  ],
})
export class AppModule {}
