import { Component, HostListener, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCurrentUserProfile } from '../../../auth/store/auth.selector';
import { deleteinvoice, getinvoices } from '../../store/products.actions';
import { selectCurrentUserID, selectinvoices, selectIsLoading } from '../../store/products.selector';

@Component({
  selector: 'app-invoice-home',
  templateUrl: './invoice-home.component.html',
  styleUrls: ['./invoice-home.component.scss'],
})
export class InvoiceHomeComponent implements OnInit {
  constructor(private store: Store) {}
  initialScroll: number = 6;
  invoices$: Observable<any> | null;
  isLoading$: Observable<any> | null;
  isLoading: boolean;
  limit = 10;
  userID: string;
  throttle = 0;
  distance = 1;
  count = 0;
  // page = 1;
  ngOnInit(): void {
    this.invoices$ = this.store.pipe(select(selectinvoices));

    this.store.pipe(select(selectIsLoading)).subscribe((bool) => {
      this.isLoading = bool;
    });
    // this.isLoading$ = this.store.pipe(select(select));
    this.store.pipe(select(selectCurrentUserID)).subscribe((id) => {
      console.log('id', id);
      this.userID = id;
    });
    this.invoices$.subscribe((data) => {
      console.log(data);
      this.count = data.count;
    });
  }

  deleteInvoice(invoiceID: string) {
    if (confirm('Are You Sure to Delete Invoice')) {
      this.store.dispatch(deleteinvoice({ invoiceID }));
    }
  }
  trackElement(index: number, item: any) {
    return item._id;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    console.log('bottom reached');
    this.onScrollEvent();
  }
  onScrollEvent() {
    console.log('initialScroll', window.innerHeight);
    console.log('window.scrollY ', window.scrollY);
    console.log('window.scrollY ', document.body.offsetHeight);
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 20) {
      console.log('limit', this.limit);
      console.log('count', this.count);
      if (this.limit < this.count) {
        this.limit += 10;
        this.store.dispatch(getinvoices({ userID: this.userID, limit: this.limit }));
      }
    }
  }
  @HostListener('window:touchmove', ['$event'])
  onScrollMobile(event: any) {
    console.log('Mobile bottom reached');
    this.onScrollEvent();
  }
}
