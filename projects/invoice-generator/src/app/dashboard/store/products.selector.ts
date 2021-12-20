import { createFeatureSelector, createSelector } from '@ngrx/store';
import { customersState } from './products.reducer';

export const getProductsFeatureState = createFeatureSelector<customersState>('data');
export const selectcustomers = createSelector(getProductsFeatureState, (state: customersState) => state?.customers);

export const selectinvoices = createSelector(getProductsFeatureState, (state: customersState) => state?.invoices);
// export const selectrecentinvoices = createSelector(getProductsFeatureState, (state: customersState) => state.invoices.);

export const selectdashboard = createSelector(getProductsFeatureState, (state: customersState) => state?.dashboard);
export const selectsubscription = createSelector(
  getProductsFeatureState,
  (state: customersState) => state?.subscription
);
export const selectpaymentmethods = createSelector(
  getProductsFeatureState,
  (state: customersState) => state?.paymentMethods
);

export const selectIsLoading = createSelector(getProductsFeatureState, (state: customersState) => state.isLoading);

export const selectUserProfile = createSelector(getProductsFeatureState, (state: customersState) => state?.userProfile);

export const selectCurrentUserID = createSelector(
  getProductsFeatureState,
  (state: customersState) => state.userProfile?._id
);

export const selectCurrentUserSubscriptionID = createSelector(
  getProductsFeatureState,
  (state: customersState) => state.userProfile?.stripeSubscriptionID
);

export const selectisSubscriptionLoaded = createSelector(
  getProductsFeatureState,
  (state: customersState) => state.isSubscriptionLoaded
);

export const selectCustomerID = createSelector(
  getProductsFeatureState,
  (state: customersState) => state.userProfile?.stripeCustomerID
);
