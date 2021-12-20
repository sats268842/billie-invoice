import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { AlertmodalComponent } from '../../../shared/alertmodal/alertmodal.component';
import { addcustomer } from '../../store/products.actions';
import { selectCurrentUserID } from '../../store/products.selector';
import { MatMenuTrigger } from '@angular/material/menu';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { Variables } from '../../../shared/variables';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
  @Output() addUserState = new EventEmitter<boolean>();
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  customerForm: FormGroup;
  countryControl = new FormControl();
  filteredCountryOptions: Observable<any>;
  filteredCurrencyOptions: Observable<any>;
  stateOptionControl = new FormControl();
  currencyOptionControl = new FormControl();
  filteredStateOptions: Observable<any>;
  constructor(private store: Store, private _fb: FormBuilder) {
    this.customerForm = this.createFormGroup();
  }
  countries = Variables.countries;
  country = Variables.country;
  currencies = Variables.currencyCode;
  states = [];

  ngOnInit(): void {
    this.filteredCountryOptions = this.countryControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._countryfilter(value))
    );

    this.filteredCurrencyOptions = this.currencyOptionControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._currencyfilter(value))
    );
  }

  private _currencyfilter(value) {
    const filterValue = value.toLowerCase();
    return this.currencies.filter((option) => option.toLowerCase().includes(filterValue));
  }

  private _statefilter(value) {
    const filterValue = value ? value.toLowerCase() : '';
    return this.states.filter((option) => option.toLowerCase().includes(filterValue));
  }

  private _countryfilter(value) {
    const filterValue = value;
    return this.country.filter((option) => option?.country.toLowerCase().includes(filterValue));
  }

  onCountrySelectionChanged(event) {
    this.states = [];
    this.stateOptionControl.reset();
    console.log(event.option.value);
    this.states = this.country.filter((state) => state.country === event.option.value)[0]['states'];
    console.log('states', this.states);

    this.filteredStateOptions = this.stateOptionControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._statefilter(value))
    );

    this.customerForm.patchValue({
      address: {
        country: event.option.value,
      },
    });
  }

  onCurrencySelectionChanged(event) {
    this.customerForm.patchValue({
      defaultCurrency: event.option.value,
    });
  }

  onStateSelectionChanged(event) {
    console.log(event.option.value);
    this.customerForm.patchValue({
      address: {
        state: event.option.value,
      },
    });
  }

  displayStateFn(options): string {
    return options && options ? options : '';
  }

  displayCurrencyFn(options): string {
    return options && options ? options : '';
  }

  displayFn(country): string {
    return country && country ? country : '';
  }

  createFormGroup() {
    return new FormGroup({
      name: new FormControl('Name', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      customerType: new FormControl('', [Validators.required]),
      contactNo: new FormControl('', [Validators.required]),
      taxType: new FormControl('GST', [Validators.required]),
      taxID: new FormControl(0),
      address: this._fb.group({
        street1: new FormControl('', [Validators.required]),
        street2: new FormControl('', [Validators.required]),
        street3: new FormControl(''),
        code: new FormControl(''),
        country: new FormControl(''),
        state: new FormControl(''),
      }),
      defaultCurrency: new FormControl(0),
      notes: new FormControl(0),
      createdByUserID: new FormControl(0, [Validators.required]),
    });
  }

  onSubmit() {
    console.log(this.customerForm.value);

    if (confirm('Are you sure to add customer')) {
      this.store.pipe(select(selectCurrentUserID)).subscribe((userID) => {
        this.customerForm.value['createdByUserID'] = userID;

        console.log(this.customerForm.value);
        this.store.dispatch(addcustomer(this.customerForm.value));
        this.addUserState.emit(false);
      });
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.filteredOptions.des
  }
}
