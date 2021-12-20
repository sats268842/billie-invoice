import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { getuserprofile } from '../../dashboard/store/products.actions';
import { LogService } from '../../services/log.service';
import { AuthServiceService } from '../auth-service.service';

import * as fromAuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthServiceService,
    private router: Router,
    private logService: LogService,
    private store: Store,
    private route: ActivatedRoute
  ) {}
  public redirectUrl: string;
  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromAuthActions.login),
        tap(() => {
          this.authService.login();
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );

  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuthActions.checkAuth),
      switchMap(() => combineLatest([this.authService.isLoggedIn$, this.authService.user$])),
      switchMap(([isLoggedIn, profile]) => {
        if (isLoggedIn) {
          this.authService.setUser(profile);
          console.log('route', this.route.snapshot.queryParams.redirectUrl);
          console.log('state', this.router.routerState.toString());
          console.log('state', this.router.url);
          this.store.dispatch(getuserprofile({ email: profile.email }));
          this.redirectUrl = this.route.snapshot.queryParams.redirectUrl || '/';
          // this.router.navigate(['/dashboard'], { state: { prevPage: this.router.url } });
          this.logService.info('Users Profile:' + profile);
          return of(fromAuthActions.loginComplete({ profile, isLoggedIn }));
        } else {
          // this.router.navigate(['']);
          return of(fromAuthActions.logoutComplete());
        }
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuthActions.logout),
      tap(() => this.authService.logout()),
      switchMap(() => of(fromAuthActions.logoutComplete()))
    )
  );
}
