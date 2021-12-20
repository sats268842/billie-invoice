import { createAction, props } from '@ngrx/store';
import { Customer } from '../../shared/models/customer';

export const getcustomers = createAction('[Customers] Get Customers', props<{ userID: string; limit: number }>());
export const getcustomersComplete = createAction(
  '[Customers] Get Customers Complete',
  props<{ customers: Customer[] }>()
);
export const getcustomersFailed = createAction('[Customers] Get Customers Failed', props<{ error: any }>());

export const getuserprofile = createAction('[User Profile] Get Users Profile', props<{ email: string }>());
export const getuserprofileComplete = createAction(
  '[Users Profile] Get  Users Profile Complete',
  props<{ userProfile: any }>()
);
export const getuserprofileFailed = createAction('[User Profile] Get Users Profile Failed', props<{ error: any }>());

export const addcustomer = createAction('[Customers] add customer', props<{ customer: Customer }>());
export const addcustomerSuccess = createAction(
  '[Customers] add customer Sucess',
  props<{ customer: Customer; message: string; _id: string }>()
);
export const addcustomerFailed = createAction('[Customers] add customer Failed', props<{ error: string }>());

export const deletecustomer = createAction('[Customers] Delete Customer', props<{ customerID: string }>());
export const deletecustomerFailure = createAction('[Customers] Delete Customer Failure', props<{ error: string }>());
export const deletecustomerSuccess = createAction(
  '[Customers] Delete Customer Success',
  props<{ customerID: string }>()
);

export const getinvoices = createAction('[Invoices] Get Invoices', props<{ userID: any; limit: number }>());
export const getinvoicesComplete = createAction('[Invoices] Get Invoices Complete', props<{ invoices: any }>());
export const getinvoicesFailed = createAction('[Invoices] Get Invoices Failed', props<{ error: any }>());
export const deleteinvoice = createAction('[Invoices] Delete invoice', props<{ invoiceID: string }>());
export const deleteinvoiceFailure = createAction('[Invoices] Delete Invoice Failure', props<{ error: string }>());
export const deleteinvoiceSuccess = createAction('[Invoices] Delete Invoice Success', props<{ invoiceID: string }>());

export const getdashboard = createAction('[Dashboard] Get dashboard', props<{ userID: any }>());
export const getdashboardComplete = createAction('[Dustomers] Get Dashboard Complete', props<{ dashboard: any }>());
export const getdashboardFailed = createAction('[Dashboard] Get Dashboard Failed', props<{ error: any }>());

export const apiError = createAction('[Customers] Api Error', props<{ error: string }>());
// export const DELETE_Product = '[Product] Delete Product';
// export const DELETE_Product_SUCCESS = '[Product] Delete Product Success';
// export const DELETE_Product_FAILURE = '[Product] Delete Product Failure';

// export const deleteProduct = createAction(DELETE_Product, props<{ prodid: string }>());

// export const deleteProductSuccess = createAction(DELETE_Product_SUCCESS, props<{ prodid: string }>());

// export const deleteProductFailure = createAction(DELETE_Product_FAILURE, props<{ prodid: string }>());

export const getsubscription = createAction('[Subscription] Get subscription', props<{ subscriptionID: any }>());
export const getsubscriptionComplete = createAction(
  '[Subscription] Get subscription Complete',
  props<{ subscription: any }>()
);
export const getsubscriptionFailed = createAction('[Subscription] Get subscription Failed', props<{ error: any }>());

export const getpaymentmethods = createAction('[Payment Methods] Get paymentmethods', props<{ customerID: any }>());
export const getpaymentmethodsComplete = createAction(
  '[Payment Methods] Get paymentmethods Complete',
  props<{ paymentMethods: any }>()
);
export const getpaymentmethodsFailed = createAction(
  '[Payment Methods] Get paymentmethods Failed',
  props<{ error: any }>()
);
