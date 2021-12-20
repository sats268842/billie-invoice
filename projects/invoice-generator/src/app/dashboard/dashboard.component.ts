import { Component, OnInit } from '@angular/core';
import { AuthState } from '@auth0/auth0-angular';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { logout } from '../auth/store/auth.actions';
import { selectCurrentUserProfile } from '../auth/store/auth.selector';
import { LogService } from '../services/log.service';
import { SidenavbarService } from '../shared/sidenavbar/sidenavbar.service';
import { getdashboard, getinvoices, getuserprofile } from './store/products.actions';
import { selectCurrentUserID } from './store/products.selector';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(public sideNavService: SidenavbarService, private store: Store<any>, private logService: LogService) {}
  user$: Observable<any> | null;
  ngOnInit(): void {
    // this.store.dispatch(getdashboard());
    // this.authServic
    this.logService.info('Dasboard Component');
    this.user$ = this.store.pipe(select(selectCurrentUserProfile));
    this.user$.subscribe((user) => {
      console.log("'Dasboard Component'", user.email);
      const email = user.email;
      this.store.dispatch(getuserprofile({ email }));
    });
  }

  logOut() {
    this.store.dispatch(logout());
  }
}
