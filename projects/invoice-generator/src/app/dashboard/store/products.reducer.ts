import { Action, createReducer, on } from '@ngrx/store';
import * as productsActions from './products.actions';
import * as _ from 'lodash';
import { localStorageSync } from 'ngrx-store-localstorage';

import { Customer } from '../../shared/models/customer';
export interface customersState {
  customers: Customer[];
  invoices: any;
  dashboard: any;
  isSubscriptionLoaded: boolean;
  paymentMethods: any;
  subscription: any;
  userProfile: any;
  isLoading: boolean;
  error: string;
}

export const initialState: customersState = {
  customers: null,
  invoices: null,
  isSubscriptionLoaded: false,
  dashboard: null,
  subscription: null,
  paymentMethods: null,
  userProfile: null,
  isLoading: true,
  error: null,
};

const customersReducerInternal = createReducer(
  initialState,
  on(productsActions.getuserprofileComplete, (state, { userProfile }) => {
    return {
      ...state,
      userProfile: userProfile,
      isLoading: false,
    };
  }),
  on(productsActions.getcustomersComplete, (state, { customers }) => {
    return {
      ...state,
      customers: customers,
      count: 0,
      isLoading: false,
    };
  }),
  on(productsActions.getsubscriptionComplete, (state, { subscription }) => {
    return {
      ...state,
      subscription: subscription,
      isSubscriptionLoaded: true,
      isLoading: false,
    };
  }),
  on(productsActions.getsubscriptionFailed, (state) => {
    return {
      ...state,
      subscription: null,
      isSubscriptionLoaded: true,
      isLoading: false,
    };
  }),
  on(productsActions.getpaymentmethodsComplete, (state, { paymentMethods }) => {
    return {
      ...state,
      paymentMethods: paymentMethods,
      isLoading: false,
    };
  }),
  on(productsActions.getinvoicesComplete, (state, { invoices }) => {
    return {
      ...state,
      invoices: invoices,
      isLoading: false,
    };
  }),
  on(productsActions.getinvoicesFailed, (state, { error }) => {
    return {
      ...state,
      invoices: [],
      error: error,
      isLoading: false,
    };
  }),
  on(productsActions.getdashboardComplete, (state, { dashboard }) => {
    return {
      ...state,
      dashboard: dashboard,
      isLoading: false,
    };
  }),
  on(productsActions.getdashboardFailed, (state, { error }) => {
    return {
      ...state,
      dashboard: null,
      error: error,
      isLoading: false,
    };
  }),
  on(productsActions.addcustomer, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(productsActions.addcustomerSuccess, (state, { customer, message, _id }) => ({
    ...state,
    isLoading: false,
    _id: _id,
    message: message,
    customers: [...state.customers, customer],
  })),
  on(productsActions.addcustomerFailed, (state, { error }) => ({
    ...state,
    isLoading: false,
    error: error,
  })),
  on(productsActions.deletecustomer, (state, { customerID }) => ({
    ...state,
    isLoading: true,
  })),

  on(productsActions.deletecustomerSuccess, (state, { customerID }) => ({
    ...state,
    isLoading: false,
    customers: state.customers.filter((x) => x._id != customerID),
  })),

  on(productsActions.deletecustomerFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error: error,
  })),

  on(productsActions.deleteinvoice, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(productsActions.deleteinvoiceSuccess, (state, { invoiceID }) => ({
    ...state,
    isLoading: false,
    invoices: state.invoices.filter((x) => x._id != invoiceID),
  })),

  on(productsActions.deletecustomerFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error: error,
  }))
);
export function customersReducer(state: customersState | undefined, action: Action): customersState {
  return customersReducerInternal(state, action);
}
