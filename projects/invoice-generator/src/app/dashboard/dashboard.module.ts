import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from '../auth/store/auth.effects';
import { authReducer } from '../auth/store/auth.reducer';
import { StoreModule } from '@ngrx/store';
import { CustomersComponent } from './customers/customers.component';
import { customersReducer } from './store/products.reducer';
import { customersEffects } from './store/products.effects';
import { InvoicesComponent } from './invoices/invoices.component';
import { InvoiceService } from '../services/invoice.service';
import { InvoiceHomeComponent } from './invoices/invoice-home/invoice-home.component';
import { SettingsComponent } from './settings/settings.component';
import { AddCustomerComponent } from './customers/add-customer/add-customer.component';
import { PlanandbillingComponent } from './settings/planandbilling/planandbilling.component';
import { SubscriptionService } from './services/subscription.service';
import { NgxStripeModule } from 'ngx-stripe';
import { ViewCustomerComponent } from './customers/view-customer/view-customer.component';
import { ViewInvoiceComponent } from './invoices/view-invoice/view-invoice.component';
import { environment } from '../../environments/environment';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    CustomersComponent,
    InvoicesComponent,
    InvoiceHomeComponent,
    SettingsComponent,
    AddCustomerComponent,
    PlanandbillingComponent,
    ViewCustomerComponent,
    ViewInvoiceComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    DashboardRoutingModule,
    // NgxStripeModule.forChild(),
    NgxStripeModule.forRoot(environment.stripeSecretKey),
    StoreModule.forFeature('data', customersReducer),
    EffectsModule.forFeature([customersEffects]),
  ],
  providers: [InvoiceService, SubscriptionService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule {}
