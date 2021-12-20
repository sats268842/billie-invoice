import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { checkAuth } from '../auth/store/auth.actions';
import { selectCurrentUserProfile } from '../auth/store/auth.selector';
import {
  getcustomers,
  getinvoices,
  getpaymentmethods,
  getsubscription,
  getuserprofile,
} from '../dashboard/store/products.actions';
import {
  selectCurrentUserID,
  selectCurrentUserSubscriptionID,
  selectCustomerID,
} from '../dashboard/store/products.selector';

@Injectable({
  providedIn: 'root',
})
export class ResolverResolver implements Resolve<boolean> {
  constructor(private store: Store) {}
  user$: Observable<any>;
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.store.dispatch(checkAuth());
    this.store.pipe(select(selectCurrentUserProfile)).subscribe((user: any) => {
      if (user !== null || undefined) {
        console.log(user);
        console.log("'Dashboard Resolver'");
        this.store.dispatch(getuserprofile({ email: user.email }));
      }
    });
    this.store.pipe(select(selectCustomerID)).subscribe((customerid) => {
      let customerID = customerid;
      if (customerid !== null) {
        this.store.dispatch(getpaymentmethods({ customerID: customerid }));
      }
    });
    this.store.pipe(select(selectCurrentUserSubscriptionID)).subscribe((id) => {
      console.log("'Dashboard Resolver: SUBScription'", id);
      if (id) {
        this.store.dispatch(getsubscription({ subscriptionID: id }));
      }
    });

    this.store.pipe(select(selectCurrentUserID)).subscribe((userID) => {
      if (userID !== null) {
        this.store.dispatch(getcustomers({ userID, limit: 10 }));
        this.store.dispatch(getinvoices({ userID, limit: 10 }));
      }
    });
    return of(true);
  }
}
