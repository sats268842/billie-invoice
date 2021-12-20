import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getinvoices } from '../store/products.actions';
import { selectCurrentUserID } from '../store/products.selector';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnInit {
  viewInvoiceStatus: boolean = false;
  constructor(private store: Store) {
    // this.store.pipe(select(selectCurrentUserID)).subscribe((userID) => {
    //   this.store.dispatch(getinvoices({ userID }));
    // });
  }

  ngOnInit(): void {
    // this.store.pipe(select(selectCurrentUserID)).subscribe((userID) => {
    //   this.store.dispatch(getinvoices({ userID, limit: 10 }));
    // });
  }

  doClose(value) {
    this.viewInvoiceStatus = false;
  }
}
