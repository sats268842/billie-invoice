import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { checkAuth } from './auth/store/auth.actions';
import { AuthState } from './auth/store/auth.reducer';
import { selectIsLoading } from './dashboard/store/products.selector';
import { LogService } from './services/log.service';
declare var gtag;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'invoice-generator';
  googlecode = environment.googleCode;
  isLoading$: Observable<any>;
  constructor(private router: Router, private store: Store<any>, private logService: LogService) {
    if (environment.production) {
      // this.router.navigate(['/comingsoon']);
    }
    this.isLoading$ = this.store.pipe(select(selectIsLoading));
    this.logService.log('AppComponent constructor');
    // this.store.dispatch(checkAuth());
    // const navEndEvent$ = router.events.pipe(
    //   filter(e => e instanceof NavigationEnd)
    // );
    // navEndEvent$.subscribe((e: NavigationEnd) => {
    //   gtag('config', 'G-2JBKSC1404', {'page_path':e.urlAfterRedirects});
    // });
  }
}
