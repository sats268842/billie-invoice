import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../shared/page-not-found/page-not-found.component';

import { HomeComponent } from './home/home.component';
import { InvoiceGeneratorComponent } from './invoice-generator/invoice-generator.component';
// import { InvoiceTemplateComponent } from './invoice-generator/invoice-template/invoice-template.component';
import { MainpageComponent } from './mainpage.component';
import { PrivacyPoliciesComponent } from './privacy-policies/privacy-policies.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

const routes: Routes = [
  {
    path: '',
    component: MainpageComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'privacy',
        component: PrivacyPoliciesComponent,
      },
    ],
  },

  { path: '**', component: PageNotFoundComponent },
  //  {
  //     path: 'invoice-generator',
  //     component: InvoiceGeneratorComponent,
  //   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainpageRoutingModule {}
