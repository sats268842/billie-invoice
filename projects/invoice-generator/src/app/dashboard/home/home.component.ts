import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from '../../auth/store/auth.reducer';
import { selectCurrentUserProfile } from '../../auth/store/auth.selector';

import { getdashboard } from '../store/products.actions';
import { selectCurrentUserID, selectdashboard, selectinvoices } from '../store/products.selector';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user$: Observable<any> | null;
  dashboard$: Observable<any> | null;
  constructor(private store: Store<AuthState>) {}
  recentinvoices$: Observable<any> | null;

  ngOnInit(): void {
    this.dashboard$ = this.store.pipe(select(selectdashboard));
    this.store.pipe(select(selectCurrentUserID)).subscribe((userID) => {
      this.store.dispatch(getdashboard({ userID }));
    });
    this.user$ = this.store.pipe(select(selectCurrentUserProfile));

    this.recentinvoices$ = this.store.pipe(select(selectinvoices));
  }
}
