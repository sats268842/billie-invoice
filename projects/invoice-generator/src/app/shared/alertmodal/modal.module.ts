import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertmodalComponent } from 'src/app/shared/alertmodal/alertmodal.component';

@NgModule({
  declarations: [AlertmodalComponent],
  imports: [CommonModule],
  exports: [AlertmodalComponent],
})
export class ModalModule {}
