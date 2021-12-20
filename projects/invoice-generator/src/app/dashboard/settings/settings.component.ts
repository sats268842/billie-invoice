import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCurrentUserProfile } from '../../auth/store/auth.selector';
import { SubscriptionService } from '../services/subscription.service';
import {
  selectCurrentUserID,
  selectCurrentUserSubscriptionID,
  selectCustomerID,
  selectpaymentmethods,
  selectsubscription,
  selectUserProfile,
} from '../store/products.selector';
import { PlanandbillingComponent } from './planandbilling/planandbilling.component';
import { Variables } from '../../shared/variables';
import { environment } from 'projects/invoice-generator/src/environments/environment';
import { ModalService } from '../../shared/alertmodal/modal.service';

import { loadStripe, StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { getpaymentmethods } from '../store/products.actions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(
    private store: Store,
    private stripeService: StripeService,
    public dialog: MatDialog,
    private _subscriptionManager: SubscriptionService,
    private _modalService: ModalService
  ) {}
  user$: Observable<any> | null;
  userID: string;
  paymentMethods: any;
  subID: string;
  subscriptions: any;
  customerID: string;
  error: boolean = false;
  errorMessage: string;
  subscription$: Observable<any>;
  paymentMethods$: Observable<any>;
  user: any;
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  ngOnInit(): void {
    this.user$ = this.store.pipe(select(selectCurrentUserProfile));
    this.store.pipe(select(selectCustomerID)).subscribe((customerID) => {
      this.customerID = customerID;
      if (customerID) {
        this.paymentMethods$ = this.store.pipe(select(selectpaymentmethods));
      }
    });
    this.store.pipe(select(selectCurrentUserID)).subscribe((userid) => {
      this.userID = userid;
    });

    this.store.pipe(select(selectUserProfile)).subscribe((user) => {
      this.user = user;
    });

    this.subscription$ = this.store.pipe(select(selectsubscription));
  }
  plans = Variables.plans;
  stripePromise = loadStripe(environment.stripeSecretKey);

  openDialog() {
    const dialogRef = this.dialog.open(PlanandbillingComponent, {
      autoFocus: false,
      maxHeight: '90vh',
      minWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#00000',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  };
  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  async createPaymentMethod() {
    this.stripeService
      .createPaymentMethod({
        type: 'card',
        card: this.card.element,
        billing_details: {
          name: this.user?.name,
          email: this.user?.email,
        },
        metadata: {
          customerID: this.customerID,
        },
      })
      .subscribe((result) => {
        if (result.paymentMethod) {
          const pack = {
            paymentMethodId: result.paymentMethod,
            customerID: this.customerID,
            userID: this.userID,
            websiteURL: environment.websiteURL,
          }; // Send the payment method and customer ID to your server

          this.error = false;
          console.log(result.paymentMethod.id);
          this._subscriptionManager.addPaymentMethod(pack).subscribe((data) => {
            this._modalService.openDialog('Success', 'Payment Method added Successfully', 'success');
            // this.getPaymentMethods()
            this.store.dispatch(getpaymentmethods({ customerID: this.customerID }));

            this.card.element.clear();
          });
        } else if (result.error) {
          // Error creating the token
          this.errorMessage = result.error.message;
          this.error = true;
          console.log(result.error.message);
        }
      });
  }

  // getPaymentMethods() {
  //   this._subscriptionManager.getPaymentMethods(this.customerID).subscribe((data) => {
  //     this.paymentMethods = data;
  //   });
  // }

  getSubscriptions() {
    if (this.subID) {
      this._subscriptionManager.getSubscriptionByID(this.subID).subscribe((data) => {
        if (data) {
          this.subscriptions = data;
        }
        console.log(data);
      });
    }
  }

  viewSubscription() {
    const pack = {
      customerID: this.customerID,
      websiteURL: environment.websiteURL,
    };
    // const stripe = await this.stripePromise;
    this._subscriptionManager.addBillingPortal(pack).subscribe((data) => {
      window.open(data, '_blank');
    });
  }

  deletePaymentMethod(id) {
    this._subscriptionManager.deletePaymentMethod(id).subscribe((data) => {
      // this.getPaymentMethods();
      this.store.dispatch(getpaymentmethods({ customerID: this.customerID }));
    });
  }
}
