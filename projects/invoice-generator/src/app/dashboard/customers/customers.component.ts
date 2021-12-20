import { Component, HostListener, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { Customer } from '../../shared/models/customer';
import { Variables } from '../../shared/variables';
import { deletecustomer, getcustomers } from '../store/products.actions';
import { customersState } from '../store/products.reducer';
import { selectCurrentUserID, selectcustomers, selectIsLoading } from '../store/products.selector';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  constructor(private store: Store<customersState>) {}
  viewCustomerStatus: boolean = false;
  customers$: Observable<Customer[]> | null;
  selectedCustomer: any;
  isLoading$: Observable<boolean> | null;
  isLoading;
  userID: string;

  addUserState: boolean = false;
  limit: number = 5;
  ngOnInit(): void {
    this.store.pipe(select(selectCurrentUserID)).subscribe((userID) => {
      let limit = this.limit;
      this.userID = userID;
      // this.store.dispatch(getcustomers({ userID, limit }));
    });
    this.customers$ = this.store.pipe(select(selectcustomers));
    this.isLoading$ = this.store.pipe(select(selectIsLoading));
    this.isLoading$.subscribe((data) => {
      console.log(data);
      this.isLoading = data;
    });

    // isL
  }
  selectCustomer(item) {
    this.selectedCustomer = item;
    this.viewCustomerStatus = !this.viewCustomerStatus;
  }
  doClose(value) {
    this.viewCustomerStatus = false;
  }

  deleteCustomer(customerID: string) {
    this.store.dispatch(deletecustomer({ customerID }));
  }
  trackElement(index: number, item: any) {
    return item._id;
  }
  addUser() {
    this.addUserState = !this.addUserState;
  }
  changeHide(val: boolean) {
    console.log('emit', val);
    this.addUserState = val;
  }
  @HostListener('window:scroll', ['$event'])
  someFunction(event) {
    // console.log(event)
    let limit = this.limit;
    let userID = this.userID;
    if (window.scrollY > 5) {
      this.limit = this.limit + 5;
      this.store.dispatch(getcustomers({ userID, limit }));
    }
    // console.log(window)
  }
}
