import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthServiceService } from '../auth/auth-service.service';
import { selectCurrentUserID } from '../dashboard/store/products.selector';

import { Customer } from '../shared/models/customer';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  userId: string;
  constructor(private http: HttpClient, private store: Store, private _authService: AuthServiceService) {
    // this.get_all_buckets();
  }
  s3ListSubject = new BehaviorSubject(null);
  readonly s3List$ = this.s3ListSubject.asObservable();
  apiURL = environment.apiUrl;
  apiURL2 = environment.apiUrlM;

  generateInvoice(invoice) {
    // print()
    console.log(invoice);
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.post<any>(this.apiURL + `/invoice/`, invoice, {
      headers: headers,
      responseType: 'blob' as 'json',
    });
  }

  getCustomers() {
    return this.http.get<any>(this.apiURL2 + `/customers/`).pipe(
      map((response: Customer[]) => response),
      catchError((err) => {
        console.log(err);
        return of([]);
      })
    );
  }

  addCustomer(data) {
    console.log(data);
    return this.http.post<any>(this.apiURL2 + `/customers/addcustomer/`, data);
  }

  addInvoice(data): Observable<any> {
    console.log('addInvoice: Service');
    this.store.pipe(select(selectCurrentUserID)).subscribe((id) => {
      this.userId = id;
    });
    data['createdByUserID'] = this.userId;
    console.log(data);

    return this.http.post<any>(this.apiURL2 + `/invoice/addinvoice/`, data);
  }
  sendInvoice(data): Observable<any> {
    // this.store.pipe(select(selectCurrentUserID)).subscribe((id) => {
    //   this.userId = id;
    // });
    // data['userID'] = this.userId;
    return this.http.post<any>(this.apiURL2 + `/invoice/sendinvoice/`, data);
  }

  getInvoicesbyUserId(userId, limit) {
    return this.http.get<any>(this.apiURL2 + `/invoice/getinvoicebyuserid/${userId}?limit=${limit}`);
  }

  getInvoicesbyCustomerId(customerID, limit) {
    return this.http.get<any>(this.apiURL2 + `/customers/getinvoicesbycustomerid/${customerID}?limit=${limit}`);
  }

  getCustomersbyUserId(userId, limit = 5) {
    return this.http.get<any>(this.apiURL2 + `/customers/getcustomersbyuserid/${userId}?skip=0&limit=${limit}`).pipe(
      map((response: Customer[]) => response),
      catchError((err) => {
        console.log(err);
        return of([]);
      })
    );
  }

  deleteCustomersbyCustId(id) {
    return this.http.delete<any>(this.apiURL2 + `/customers/deletecustomersbycustomerid/${id}`);
  }

  deleteInvoicebyInvId(id) {
    return this.http.delete<any>(this.apiURL2 + `/invoice/deleteinvoicebyinvoiceid/${id}`);
  }

  getUserProfile(email): Observable<any> {
    console.log('getuserprofile', email);
    return this.http.get<any>(this.apiURL2 + `/usermanagement/getuser/${email}`);
  }

  getDashboardbyUserId(userID): Observable<any> {
    return this.http.get<any>(this.apiURL2 + `/dashboard/getdashboardbyuserid/${userID}`).pipe(
      map((response: any) => response),
      catchError((err) => {
        console.log(err);
        return of([]);
      })
    );
  }
}
