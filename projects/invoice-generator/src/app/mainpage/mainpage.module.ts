import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainpageComponent } from './mainpage.component';

import { SharedModule } from '../shared/shared.module';
import { MainpageRoutingModule } from './mainpage-routing.module';
import { HomeComponent } from './home/home.component';

import { InvoiceGeneratorComponent } from './invoice-generator/invoice-generator.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { PrivacyPoliciesComponent } from './privacy-policies/privacy-policies.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PricingComponent } from './pricing/pricing.component';
// import { InvoiceServiceService } from './invoice-generator/invoice-service.service';

@NgModule({
  declarations: [
    MainpageComponent,
    HomeComponent,
    InvoiceGeneratorComponent,
    LandingpageComponent,
    PrivacyPoliciesComponent,
    TermsAndConditionsComponent,
    PricingComponent,
  ],
  imports: [MainpageRoutingModule, SharedModule],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainpageModule {}
