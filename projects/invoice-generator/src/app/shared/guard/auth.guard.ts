import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../../auth/auth-service.service';
import { selectIsLoggedIn } from '../../auth/store/auth.selector';
import { LogService } from '../../services/log.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthServiceService,
    public router: Router,
    public store: Store,
    private logService: LogService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let loggedIn$ = this.store.pipe(select(selectIsLoggedIn));
    let isLoggedin: boolean;
    loggedIn$.subscribe((data) => {
      this.logService.info(`Islogged in:+ ${data}`);
      isLoggedin = data;
      if (data) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['./home']);
      }
    });

    return isLoggedin;
  }
}
