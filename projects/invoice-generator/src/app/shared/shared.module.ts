import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SidenavbarComponent } from './sidenavbar/sidenavbar.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertmodalComponent } from './alertmodal/alertmodal.component';

import { LoaderComponent } from './loader/loader.component';
import { NotificationComponent } from './notification/notification.component';

import { ToastmessageComponent } from './toastmessage/toastmessage.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { SidenavbarComponent } from './sidenavbar/sidenavbar.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { DateAgoPipe } from './pipes/date-ago.pipe';
// import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatDialogModule } from '@angular/material/dialog';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { ComingsoonComponent } from './comingsoon/comingsoon.component';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [
    SidenavbarComponent,
    AlertmodalComponent,
    LoaderComponent,
    NotificationComponent,
    ToastmessageComponent,
    FooterComponent,
    NavbarComponent,
    TooltipDirective,
    DateAgoPipe,
    TimeAgoPipe,
    ComingsoonComponent,
  ],
  imports: [CommonModule, RouterModule, MatDialogModule, MatAutocompleteModule],
  exports: [
    DateAgoPipe,
    FooterComponent,
    TooltipDirective,
    NavbarComponent,
    MatDialogModule,
    TimeAgoPipe,
    // AlertmodalComponent,
    CommonModule,
    SidenavbarComponent,
    MatAutocompleteModule,
    ReactiveFormsModule,
    LoaderComponent,
    HttpClientModule,
    NotificationComponent,
    MatSelectModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
