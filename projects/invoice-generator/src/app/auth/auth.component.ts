import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsLoading } from '../dashboard/store/products.selector';
import { LogService } from '../services/log.service';
import { AuthServiceService } from './auth-service.service';
import { checkAuth, login } from './store/auth.actions';
import { selectCurrentUserProfile, selectIsLoggedIn } from './store/auth.selector';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  loggedIn$: Observable<boolean> | undefined;
  isLoading$: Observable<boolean> | undefined;
  profile$: Observable<any> | undefined;
  constructor(
    private logService: LogService,
    private activatedRoute: ActivatedRoute,
    private store: Store<any>,
    private router: Router,
    public authService: AuthServiceService
  ) {}
  errorMessage: string = '';
  ngOnInit(): void {
    if (this.activatedRoute.snapshot.queryParams?.code === 'INVALID_SESSION') {
      this.logService.error('Invalid session! Please login again');
    }
    this.loggedIn$ = this.store.pipe(select(selectIsLoggedIn));

    // this.profile$ = this.store.pipe(select(selectCurrentUserProfile));
    // this.store.dispatch(checkAuth());
  }
  logIn() {
    this.store.dispatch(login());
  }
}
