import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { loadStripe } from '@stripe/stripe-js';
import { SubscriptionService } from '../../services/subscription.service';
import {
  selectCurrentUserID,
  selectCurrentUserSubscriptionID,
  selectCustomerID,
  selectsubscription,
} from '../../store/products.selector';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { Variables } from '../../../shared/variables';
import { environment } from 'projects/invoice-generator/src/environments/environment';
import { ModalService } from '../../../shared/alertmodal/modal.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-planandbilling',
  templateUrl: './planandbilling.component.html',
  styleUrls: ['./planandbilling.component.scss'],
})
export class PlanandbillingComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  error: boolean = false;
  errorMessage: string;
  selectedPlan: any;
  paymentMethods: any;
  selectedCard: any;
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

  PaymentMethodID;

  customerID;
  userID;
  subID;
  subscriptions: any;
  paymentHandler: any = null;
  plans;
  any;
  subscriptions$: Observable<any>;
  stripePromise = loadStripe(environment.stripeSecretKey);

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private store: Store,
    private _subscriptionManager: SubscriptionService,
    private stripeService: StripeService,
    private _modalService: ModalService
  ) {
    if (environment.production) {
      this.plans = Variables.plansProduction;
    } else {
      this.plans = Variables.plans;
    }
  }

  onPaymentMethodChange(paymentMethod: any) {
    this.selectedCard = paymentMethod;
    console.log('selected card', this.selectedCard);
  }

  ngOnInit(): void {
    this.invokeStripe();
    this.store.pipe(select(selectsubscription)).subscribe((data) => {
      this.subscriptions = data;
    });
    this.store.pipe(select(selectCustomerID)).subscribe((customerid) => {
      this.customerID = customerid;
      this.getPaymentMethods();
    });
    this.store.pipe(select(selectCurrentUserSubscriptionID)).subscribe((id) => {
      this.subID = id;
      // this.getSubscriptions();
    });
  }

  createPaymentMethod(): void {
    this.stripeService
      .createPaymentMethod({
        type: 'card',
        card: this.card.element,
        billing_details: { name: null },
      })
      .subscribe((result) => {
        if (result.paymentMethod) {
          const pack = {
            paymentMethodId: result.paymentMethod,
            customerID: this.customerID,
            priceID: this.selectedPlan?.planDetails.id,
            userID: this.userID,
            websiteURL: environment.websiteURL,
          }; // Send the payment method and customer ID to your server

          this.error = false;
          console.log(result.paymentMethod.id);
          this._subscriptionManager.addPaymentMethod(pack).subscribe((data) => {
            this._modalService.openDialog('Success', 'Payment Method added Successfully', 'success');
          });
        } else if (result.error) {
          // Error creating the token
          this.errorMessage = result.error.message;
          this.error = true;
          console.log(result.error.message);
        }
      });
  }

  getPaymentMethods() {
    this._subscriptionManager.getPaymentMethods(this.customerID).subscribe((data) => {
      this.paymentMethods = data;
    });
  }

  // getSubscriptions() {
  //   if (this.subID) {
  //     this._subscriptionManager.getSubscriptionByID(this.subID).subscribe((data) => {
  //       this.subscriptions = data;
  //       console.log(data);
  //     });
  //   }
  // }

  onSelectCard(card) {
    this.selectedCard = card;
    console.log(this.selectedCard);
  }
  onPlanSelect(plan) {
    this.selectedPlan = plan;
    console.log(this.selectedPlan);
  }
  async pay() {
    const pack = {
      paymentMethodId: this.selectedCard.id,
      customerID: this.customerID,
      priceID: this.selectedPlan?.planDetails.id,
      userID: this.userID,
      websiteURL: environment.websiteURL,
    };
    const stripe = await this.stripePromise;
    this._subscriptionManager.addCheckoutSession(pack).subscribe((data) => {
      stripe
        .redirectToCheckout({
          sessionId: data.id,
        })
        .then((data) => {
          console.log(data);
          // this._subscriptionManager.addSubscription(pack).subscribe((data) => {
          //   Swal.fire('Success', 'Subscription Created Successfully', 'success');
          // });
        })
        .catch((error) => {
          console.log(data);
        });
    });

    // alert('Stripe token generated!');

    // paymentHandler
    // const stripe = await this.stripePromise;
    // const { error } = await stripe.redirectToCheckout({
    //   mode: 'payment',
    //   lineItems: [{ price: this.selectedPlan?.planDetails.id, quantity: 1 }],
    //   successUrl: `${window.location.href}/success`,
    //   cancelUrl: `${window.location.href}/failure`,
    // });

    // paymentHandler.open({
    //   name: 'Billie',
    //   description: '3 widgets',
    //   amount: this.selectedPlan?.planDetails.amount
    // });
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement('script');
      s.id = 'stripe-script';
      s.type = 'text/javascript';
      s.src = 'https://checkout.stripe.com/checkout.js';
      window.document.body.appendChild(s);
    }
  }

  viewSubscription() {
    const pack = {
      customerID: this.customerID,
      websiteURL: environment.websiteURL,
    };
    console.log(pack);
    // const stripe = await this.stripePromise;
    this._subscriptionManager.addBillingPortal(pack).subscribe((data) => {
      window.open(data, '_blank');
    });
  }

  deletePaymentMethod(id) {
    this._subscriptionManager.deletePaymentMethod(id).subscribe((data) => {
      this.getPaymentMethods();
    });
  }
}
