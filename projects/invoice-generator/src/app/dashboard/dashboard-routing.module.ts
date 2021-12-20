import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceGeneratorComponent } from '../mainpage/invoice-generator/invoice-generator.component';
import { SubscriptionGuard } from '../shared/guard/subscription.guard';
import { DashboardResolver } from '../shared/resolvers/dashboard.resolver';
import { CustomersComponent } from './customers/customers.component';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { InvoiceHomeComponent } from './invoices/invoice-home/invoice-home.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
      },
      {
        path: 'customers',
        component: CustomersComponent,
        // canActivate: [SubscriptionGuard],
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'invoices',
        component: InvoicesComponent,
        canActivate: [SubscriptionGuard],
        children: [
          {
            path: '',
            component: InvoiceHomeComponent,
          },
          {
            path: 'invoice-generator',
            component: InvoiceGeneratorComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
