import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'projects/invoice-generator/src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { AuthServiceService } from '../../auth/auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  constructor(private http: HttpClient, private store: Store, private _authService: AuthServiceService) {
    // this.get_all_buckets();
  }
  s3ListSubject = new BehaviorSubject(null);
  readonly s3List$ = this.s3ListSubject.asObservable();
  apiURL = environment.apiUrl;
  apiURL2 = environment.apiUrlM;

  addSubscription(data) {
    console.log(data);
    return this.http.post<any>(this.apiURL2 + `/subscription/createsubscription`, data);
  }

  addCheckoutSession(data) {
    console.log(data);
    return this.http.post<any>(this.apiURL2 + `/subscription/createcheckoutsession`, data);
  }

  addBillingPortal(data) {
    console.log(data);
    return this.http.post<any>(this.apiURL2 + `/subscription/createportalsession`, data);
  }

  addPaymentMethod(data) {
    console.log(data);
    return this.http.post<any>(this.apiURL2 + `/subscription/createpaymentmethod`, data);
  }

  getSubscription(data) {
    console.log(data);
    return this.http.post<any>(this.apiURL2 + `/subscription/createsubscription`, data);
  }

  getPaymentMethods(customerID: string) {
    return this.http.get<any>(this.apiURL2 + `/subscription/listcustomerspayment/${customerID}`);
  }

  getSubscriptionByUserID(userID: string) {
    return this.http.get<any>(this.apiURL2 + `/subscription/getsubscriptionbyuserid/${userID}`);
  }

  getSubscriptionByID(subID: string) {
    return this.http.get<any>(this.apiURL2 + `/subscription/getsubscriptionbyid/${subID}`);
  }

  deletePaymentMethod(paymentMethodID: string) {
    return this.http.delete<any>(this.apiURL2 + `/subscription/deletepaymentmethod/${paymentMethodID}`);
  }
}
