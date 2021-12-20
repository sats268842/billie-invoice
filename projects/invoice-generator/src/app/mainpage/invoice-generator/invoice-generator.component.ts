import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Injector,
  NgZone,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Variables } from '../../shared/variables';
import {
  getSupportedInputTypes,
  Platform,
  supportsPassiveEventListeners,
  supportsScrollBehavior,
} from '@angular/cdk/platform';
import { saveAs } from 'file-saver';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { InvoiceService } from '../../services/invoice.service';
import { isPlatformBrowser } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { AuthState } from '../../auth/store/auth.reducer';
import { selectIsLoggedIn } from '../../auth/store/auth.selector';
import { InvoiceServiceService } from 'src/app/dashboard/invoice-generator/invoice-service.service';
import { selectCustomerID, selectcustomers } from '../../dashboard/store/products.selector';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../../shared/alertmodal/modal.service';
import { concatMap, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-invoice-generator',
  templateUrl: './invoice-generator.component.html',
  styleUrls: ['./invoice-generator.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class InvoiceGeneratorComponent implements OnInit {
  id = 0;
  tax = 18;
  isLoading: boolean = false;
  totalCost: number = 0;
  invoiceForm: FormGroup;
  currentDate: string;
  subTotalCost: number = 0;
  image: any;
  currency = 'INR';
  activate: boolean = false;
  html;
  isLoggedIn: boolean = false;
  currencyCode: string[] = Variables.currencyCode;
  customers: any;
  customerID: string;
  termsandconditionid: number = 0;

  constructor(
    private zone: NgZone,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private store: Store<AuthState>,
    private injector: Injector,
    private _invoiceService: InvoiceService,
    private resolver: ComponentFactoryResolver,
    private _modalService: ModalService,
    private _invoiceGeneratorService: InvoiceService,
    public platform: Platform,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentDate = new Date().toLocaleDateString();
    this.invoiceForm = this.createFormGroup();
  }
  @ViewChild('container', { static: true, read: ViewContainerRef })
  container!: ViewContainerRef;
  ngOnInit(): void {
    this.store.pipe(select(selectIsLoggedIn)).subscribe((bool) => {
      this.isLoggedIn = bool;
    });

    this.store.pipe(select(selectcustomers)).subscribe((customers) => {
      this.customers = customers;
    });

    this.store.pipe(select(selectCustomerID)).subscribe((customerID) => {
      this.customerID = customerID;
    });
  }

  currencyValueChange(value) {
    // console.log(value)
    this.invoiceForm.patchValue({
      currency: value,
    });
    this.currency = value;
    this.calculateTotalPrice();
  }

  createFormGroup() {
    return new FormGroup({
      invoiceID: new FormControl('#0001', [Validators.required]),
      currency: new FormControl('INR', [Validators.required]),
      currentDate: new FormControl(this.currentDate, [Validators.required]),
      dueDate: new FormControl('', [Validators.required]),
      tax: new FormControl(18, [Validators.required]),
      total: new FormControl(0, [Validators.required]),
      createdByCustomerID: new FormControl(null),
      from: new FormGroup({
        name: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        phoneNumber: new FormControl('', [Validators.required]),
        logo: new FormControl('', [Validators.required]),
      }),
      to: new FormGroup({
        customerID: new FormControl(''),
        name: new FormControl('', [Validators.required]),
        phoneNumber: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
      }),
      services: new FormArray([]),
      discount: new FormControl(0, [Validators.required]),
      termsandconditions: new FormArray([]),
    });
  }
  removeService(index: number) {
    (this.invoiceForm.get('services') as FormArray).removeAt(index);
    this.calculateTotalPrice();
  }

  onCustomerChange(customer: any) {
    console.log(customer);
    let address = customer.address.street1 + '' + customer.address.street2;
    this.invoiceForm.patchValue({
      to: {
        customerID: customer._id,
        name: customer.name,
        phoneNumber: customer.contactNo,
        address: address,
        state: customer.address?.state,
        email: customer.email,
        country: customer.address?.country,
      },
      currency: customer.defaultCurrency,
    });
    this.currency = customer.defaultCurrency;
  }

  removetermsandconditions(index: number) {
    (this.invoiceForm.get('termsandconditions') as FormArray).removeAt(index);
    this.calculateTotalPrice();
  }

  discountValueChange(discountValue: number) {
    this.calculateTotalPrice();
    this.totalCost = this.totalCost - discountValue;
  }

  newService(i): FormGroup {
    this.id++;
    return this.fb.group({
      id: this.id,
      service: '',
      description: '',
      quantity: '1',
      price: '0',
    });
  }

  newtermsandconditions(i): FormGroup {
    this.termsandconditionid++;
    return this.fb.group({
      id: this.termsandconditionid,
      description: '',
    });
  }
  onAddtermsandconditions(i) {
    let length = (this.invoiceForm.get('termsandconditions') as FormArray).length;
    if (length < 10) {
      (this.invoiceForm.get('termsandconditions') as FormArray).push(this.newtermsandconditions(i));
    }
  }

  calculateTotalPrice() {
    const services: [] = this.invoiceForm.get('services').value;
    this.subTotalCost = 0;
    services.forEach((element: any) => {
      this.subTotalCost += +element.price * +element.quantity;
    });
    this.calculateTax(this.tax);
  }

  calculateTax(tax) {
    this.totalCost = 0;
    this.tax = tax;

    this.totalCost = this.subTotalCost + (this.subTotalCost * this.tax) / 100;
    this.invoiceForm.patchValue({
      total: this.totalCost,
    });
  }

  valueChange(value) {
    // console.log(value)
    this.invoiceForm.patchValue({
      tax: value,
    });
    this.tax = value;
    this.calculateTotalPrice();
  }

  onAddServices(i) {
    let length = (this.invoiceForm.get('services') as FormArray).length;
    const control = new FormControl(null, Validators.required);
    if (length < 3) {
      (this.invoiceForm.get('services') as FormArray).push(this.newService(i));
      this.calculateTotalPrice();
    }
  }

  onSubmit() {}

  async openPDF() {
    this.isLoading = true;

    this._invoiceGeneratorService.generateInvoice(this.invoiceForm.value).subscribe(
      (res) => {
        // window.open(res)
        console.log(res);
        let blob = new Blob([res], { type: 'application/pdf' });
        console.log('creating Invioce');
        if (this.isLoggedIn) {
          console.log('Logged In User: creating Invioce');

          // this._invoiceService.addInvoice(this.invoiceForm.value)
          const formData: FormData = new FormData();
          formData.append('toEmail', this.invoiceForm.value.to.email);
          formData.append('fromName', this.invoiceForm.value.from.name);
          formData.append('file', res);
          //
          this.invoiceForm.patchValue({
            createdByCustomerID: this.customerID,
          });

          this._invoiceService
            .addInvoice(this.invoiceForm.value)
            .pipe(
              concatMap((data) => {
                console.log(data);
                formData.append('invoiceID', data.id);
                this._invoiceService.sendInvoice(formData).subscribe(
                  (data) => {
                    this._modalService.openDialog(
                      'Successfull',
                      'Email Send Successfully to' + ' ' + this.invoiceForm.value.to.name,
                      'success'
                    );
                  },
                  (err) => {
                    this._modalService.openDialog(
                      'Error',
                      'Email failed send to' + ' ' + this.invoiceForm.value.to.name,
                      'error'
                    );
                  }
                );
                return data;
              })
            )
            .subscribe((data) => {});
        }

        // let blob = new Blob([res], { type: 'application/pdf' });

        this.isLoading = false;
        console.log(this.platform);

        if (this.platform.ANDROID || this.platform.IOS) {
          saveAs(blob, this.invoiceForm.value.invoiceID);
        } else {
          if (isPlatformBrowser(this.platformId)) {
            let url = window.URL.createObjectURL(blob);
            let pwa = window.open(url);
          }
        }
        // this.s3ListSubject.next(res['response']);
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
    // this.isLoading = true;
    // this.container.clear();
    // document.body.style.overflow = 'hidden';
    // const factory = this.resolver.resolveComponentFactory(InvoiceTemplateComponent);
    // let componentRef: ComponentRef<InvoiceTemplateComponent> = this.container.createComponent(factory);

    // componentRef.instance.invoice = this.invoiceForm.value;

    // componentRef.changeDetectorRef.detectChanges();
    // componentRef.instance.openPDF(componentRef.location.nativeElement.innerHTML);

    // setTimeout(() => {
    //   this.isLoading = false;
    // }, 5000);
  }
}
