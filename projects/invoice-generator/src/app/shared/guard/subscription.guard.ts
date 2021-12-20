import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { AuthServiceService } from '../../auth/auth-service.service';
import { selectCurrentUserProfile, selectIsLoggedIn } from '../../auth/store/auth.selector';
import { SubscriptionService } from '../../dashboard/services/subscription.service';
import { getsubscription, getuserprofile } from '../../dashboard/store/products.actions';
import {
  selectCurrentUserSubscriptionID,
  selectisSubscriptionLoaded,
  selectsubscription,
  selectUserProfile,
} from '../../dashboard/store/products.selector';
import { LogService } from '../../services/log.service';
import { AlertmodalComponent } from '../alertmodal/alertmodal.component';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionGuard implements CanActivate {
  constructor(
    public authService: AuthServiceService,
    public router: Router,
    public store: Store,
    private logService: LogService,
    public dialog: MatDialog,
    private _subscriptionManager: SubscriptionService
  ) {}
  result: boolean;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return combineLatest(this.store.pipe(select(selectUserProfile)), this.store.pipe(select(selectsubscription))).pipe(
      map(([userProfile, subscription]) => {
        console.log('Subscription Guard: sub:', subscription);
        console.log('Subscription Guard: user:', userProfile);

        if (userProfile) {
          if (userProfile.stripeSubscriptionID.length <= 0) {
            let message = 'your subscription not found';
            console.log('susbcrp is empty');
            this.openDialog(message);
            // return of(false)
            this.router.navigate(['/dashboard']);
            return false;
          }
          if (subscription) {
            if (subscription?.status === 'active') {
              return true;
            } else if (subscription?.status === 'unpaid') {
              let message = 'your subscription is unpaid';
              this.openDialog(message);
              return false;
            } else if (subscription?.status === 'incomplete') {
              let message = 'your subscription is incompelete';
              this.openDialog(message);
              return false;
            } else if (subscription?.status === 'canceled') {
              let message = 'your subscription is canceled';
              this.openDialog(message);
              return false;
            } else if (subscription?.status === 'past_due') {
              let message = 'your subscription is expired due to renew failed';
              this.openDialog(message);
              return false;
            } else {
              // let message = 'your subscription not found'
              // this.openDialog(message)
              // return of(false)
              // this.router.navigate(['/dashboard']);
              return false;
            }
          } else {
            let message = 'your subscription not found';
            console.log('susbcrp is empty');
            this.openDialog(message);
            // return of(false)
            this.router.navigate(['/dashboard']);
            return false;
          }
        } else {
          this.router.navigate(['/dashboard']);
          return false;
        }
        // else {
        //   let message = 'your subscription not found'
        //   this.openDialog(message)
        //   // return of(false)
        //   this.router.navigate(['/dashboard']);
        //   return false;
        // }
      })
    );

    // return this.store.pipe(select(selectsubscription)).pipe(
    //   tap((subscription) => {
    //     console.log('Subscription Guard', subscription);
    //     this.store.pipe(select(selectCurrentUserProfile)).subscribe((user: any) => {
    //       if (user !== null || undefined) {
    //         console.log(user);
    //         console.log("'Dashboard Resolver'");
    //         this.store.dispatch(getuserprofile({ email: user.email }));
    //         this.store.pipe(select(selectsubscription)).subscribe((id) => {
    //           console.log('Subscription Guard [store call]', id);
    //           if (id !== null) {
    //             // this.store.dispatch(getsubscription({ subscriptionID: id }));
    //             return this.store.pipe(select(selectsubscription));
    //           } else {
    //             console.log("sub guard - subid", id)
    //             this.router.navigate(['/dashboard']);
    //             let message = 'You have not any valid Subscription';
    //             this.openDialog(message);
    //             return of(false);
    //           }
    //         })
    //       }
    //     });
    //     ;
    //   }),
    //   filter(posts => posts !== null),
    //   switchMap((subscription) => {
    //     let isLoaded;
    //     console.log('subscription guard', data);
    //     this.store.pipe(select(selectisSubscriptionLoaded)).subscribe((data) => {
    //       isLoaded = data;
    //     });
    //     if (data == null || undefined) {
    //       if (isLoaded) {
    //         this.router.navigate(['/dashboard']);
    //         let message = 'You have not any valid Subscription';
    //         this.openDialog(message);

    //         return of(false);
    //       }
    //       return of(false);
    //     }

    //     if (data?.status === 'active') {
    //       return of(true);
    //     } else if (data?.status === 'unpaid') {
    //       let message = 'your subscription is unpaid';
    //       this.openDialog(message);
    //       return of(false);
    //     } else if (data?.status === 'incomplete') {
    //       let message = 'your subscription is incompelete';
    //       this.openDialog(message);
    //       return of(false);
    //     } else if (data?.status === 'canceled') {
    //       let message = 'your subscription is canceled';
    //       this.openDialog(message);
    //       return of(false);
    //     } else if (data?.status === 'past_due') {
    //       let message = 'your subscription is expired due to renew failed';
    //       this.openDialog(message);
    //       return of(false);
    //     } else {
    //       // let message = 'your subscription not found'
    //       // this.openDialog(message)
    //       // return of(false)
    //       this.router.navigate(['/dashboard']);
    //       return of(false);
    //     }
    //   }),
    //   catchError(() => of(false))
    // );
  }
  openDialog(message) {
    const dialogRef = this.dialog.open(AlertmodalComponent, {
      autoFocus: true,
      minWidth: '40vw',
      data: {
        title: 'Error',
        message: message,
        status: 'error',
        actionURL: '/dashboard/settings',
      },
    });
  }
}
