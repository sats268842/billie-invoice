import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { act, Actions, createEffect, ofType } from '@ngrx/effects';
import { combineLatest, of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { InvoiceService } from '../../services/invoice.service';
import { Customer } from '../../shared/models/customer';

import * as fromCustomersActions from './products.actions';
import { SubscriptionService } from '../services/subscription.service';

@Injectable()
export class customersEffects {
  constructor(
    private actions$: Actions,
    private _subscriptionManager: SubscriptionService,
    private _invoiceService: InvoiceService,
    private router: Router
  ) {}

  customers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomersActions.getcustomers),
      exhaustMap((action) =>
        this._invoiceService.getCustomersbyUserId(action.userID, action.limit).pipe(
          map(
            (response: Customer[]) => fromCustomersActions.getcustomersComplete({ customers: response }),
            catchError((error: any) => of(fromCustomersActions.getcustomersFailed(error)))
          )
        )
      )
    )
  );

  subscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomersActions.getsubscription),
      exhaustMap((action) =>
        this._subscriptionManager.getSubscriptionByID(action.subscriptionID).pipe(
          map(
            (response: any) => fromCustomersActions.getsubscriptionComplete({ subscription: response }),
            catchError((error: any) => of(fromCustomersActions.getsubscriptionFailed(error)))
          )
        )
      )
    )
  );

  paymentMethods$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomersActions.getpaymentmethods),
      exhaustMap((action) =>
        this._subscriptionManager.getPaymentMethods(action.customerID).pipe(
          map(
            (response: any) => fromCustomersActions.getpaymentmethodsComplete({ paymentMethods: response }),
            catchError((error: any) => of(fromCustomersActions.getpaymentmethodsFailed(error)))
          )
        )
      )
    )
  );

  addcustomers = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomersActions.addcustomer),
      switchMap((customerData) =>
        this._invoiceService.addCustomer(customerData).pipe(
          map(
            (response: any) =>
              fromCustomersActions.addcustomerSuccess({
                customer: response.customer,
                message: response.message,
                _id: response._id,
              }),
            catchError((error: any) => of(fromCustomersActions.addcustomerFailed(error)))
          )
        )
      )
    )
  );

  userProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomersActions.getuserprofile),
      exhaustMap((action) =>
        this._invoiceService.getUserProfile(action.email).pipe(
          map(
            (response: any) => fromCustomersActions.getuserprofileComplete({ userProfile: response }),
            catchError((error) => {
              return observableOf(fromCustomersActions.getuserprofileFailed({ error }));
            })
            // catchError((error: any) => of(fromCustomersActions.loginFailure(error)))
          )
        )
      )
    )
  );

  deleteCustomerRequestEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomersActions.deletecustomer),
      mergeMap(({ customerID }) =>
        this._invoiceService.deleteCustomersbyCustId(customerID).pipe(
          map(
            (item) => fromCustomersActions.deletecustomerSuccess({ customerID: customerID }),
            catchError((error) => {
              return observableOf(fromCustomersActions.deletecustomerFailure({ error }));
            })
          )
        )
      )
    )
  );

  deleteInvoiceRequestEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomersActions.deleteinvoice),
      mergeMap(({ invoiceID }) =>
        this._invoiceService.deleteInvoicebyInvId(invoiceID).pipe(
          map(
            (item) => fromCustomersActions.deleteinvoiceSuccess({ invoiceID: invoiceID }),
            catchError((error) => {
              return observableOf(fromCustomersActions.deleteinvoiceFailure({ error }));
            })
          )
        )
      )
    )
  );

  invoices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomersActions.getinvoices),
      concatMap((action) =>
        this._invoiceService.getInvoicesbyUserId(action.userID, action.limit).pipe(
          map(
            (response: any) => fromCustomersActions.getinvoicesComplete({ invoices: response }),
            catchError((error: any) => of(fromCustomersActions.getinvoicesFailed(error)))
          )
        )
      )
    )
  );

  dashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomersActions.getdashboard),
      mergeMap((action) =>
        this._invoiceService.getDashboardbyUserId(action.userID).pipe(
          map(
            (response: any) => fromCustomersActions.getdashboardComplete({ dashboard: response }),
            catchError((error: any) => of(fromCustomersActions.getdashboardFailed(error)))
          )
        )
      )
    )
  );

  // deleteTask$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(fromProductsActions.deleteProduct),
  //     switchMap((action) => {
  //       return this._prodService.deleteProductBySku(action.prodid).pipe(
  //         map((data) => {
  //           return fromProductsActions.deleteProductSuccess({ prodid: action.prodid });
  //         })
  //       );
  //     })
  //   );
  // });
}
function observableOf(arg0: any): any {
  throw new Error('Function not implemented.');
}
