import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.scss'],
})
export class ViewCustomerComponent implements OnInit {
  @Input() customer: any | undefined;
  @Output() onCloseStatus: EventEmitter<boolean> = new EventEmitter();
  customerInvoices: any = [];
  constructor(private _customerService: InvoiceService) {}
  customerIncome: any;
  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    console.log(this.customer);
    if (this.customer) {
      this.getInvoicesbyCustomerID(this.customer?._id);
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    console.log(this.customer);
    this.getInvoicesbyCustomerID(this.customer?.customerID);
  }

  onClose() {
    this.onCloseStatus.emit(false);
  }

  getInvoicesbyCustomerID(customerID) {
    this._customerService.getInvoicesbyCustomerId(customerID, 5).subscribe((data) => {
      console.log(data);
      this.customerInvoices = data;
      let income = 0;
      this.customerInvoices.forEach((element) => {
        income = income + element?.total;
      });
      this.customerIncome = income;
    });
  }
}
