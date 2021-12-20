import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { ToasterService } from '../shared/toaster.service';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { login } from './store/auth.actions';
import { environment } from '../../environments/environment';
import { LogService } from '../services/log.service';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  userData: any; // Save logged in user data
  user = new BehaviorSubject(null);
  public apiUrl: string = environment.apiUrl;
  public apiUrl2: string = environment.apiUrlM;
  loadingSubject = new BehaviorSubject<boolean>(null);
  loading$ = this.loadingSubject.asObservable();
  email: string;
  constructor(
    private router: Router,
    private http: HttpClient,
    private toast: ToasterService,
    public auth: AuthService,
    public authService: AuthService,
    private logService: LogService,
    private store: Store // Inject Firebase auth service
  ) {
    this.auth.isLoading$.subscribe((data) => {
      this.logService.info('is Loading:' + data);
      this.loadingSubject.next(data);
    });

    this.authService.user$.subscribe((data) => {
      this.email = data.email;
      this.logService.info('Userprofile:' + data);
    });

    this.auth.error$.subscribe((err) => {
      this.auth.logout();
      this.logService.error('Auth Error Message:' + err);
      return err;
    });
    this.authService.isAuthenticated$.subscribe((data) => {
      if (data) {
      }
      this.logService.info('isAuthenticated:' + data);
    });
  }

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null && user.emailVerified !== false ? true : false;
  }

  SignOut() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.auth.logout();

    this.router.navigate(['./home']);
    this.http.post<any>(this.apiUrl + `/usermanagement/logout`, user).subscribe(
      (res) => {
        localStorage.removeItem('user');
        localStorage.removeItem('user');
        this.router.navigate(['../']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  get isLoggedIn$(): Observable<boolean> {
    this.authService.isAuthenticated$.subscribe((data) => {
      this.logService.info('isAuthenticated:' + data);
    });

    return this.authService.isAuthenticated$;
  }
  get errorMessage$(): Observable<Error> {
    return this.authService.error$;
  }
  getToken$(): Observable<string> {
    return this.authService.getAccessTokenSilently();
  }

  get user$(): Observable<any> {
    // this.auth.user$.subscribe((data) => {
    //   this.email = data.email;
    //   console.log('email', this.email);
    // });
    // this.logService.info('Get user profile');

    return this.auth.user$;
    // return this.http.get<any>(this.apiUrl2 + `/usermanagement/getuser/${this.email}`);
  }
  login(): void {
    this.logService.info('Login Clicked');
    this.authService.loginWithRedirect({
      redirect_uri: environment.websiteURL,
    });
  }
  logout(): void {
    this.authService.logout();
    localStorage.removeItem('user');
    this.logService.info('Logout Clicked');
    this.router.navigate(['../auth']);
  }
}
