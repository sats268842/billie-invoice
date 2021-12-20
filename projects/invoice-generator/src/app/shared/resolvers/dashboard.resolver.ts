import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { selectCurrentUserProfile } from '../../auth/store/auth.selector';
import { getuserprofile } from '../../dashboard/store/products.actions';

@Injectable({
  providedIn: 'root',
})
export class DashboardResolver implements Resolve<Observable<string>> {
  user$: Observable<any>;
  constructor(private store: Store) {}
  resolve(): Observable<string> {
    this.user$ = this.store.pipe(select(selectCurrentUserProfile));
    this.user$.subscribe((user) => {
      console.log("'Dasboard Component'", user.email);
      const email = user.email;
      this.store.dispatch(getuserprofile({ email }));
    });
    return null;
  }
}
