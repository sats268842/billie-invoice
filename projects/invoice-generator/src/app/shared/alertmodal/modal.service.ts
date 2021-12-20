import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
  Type,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertmodalComponent } from './alertmodal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(public dialog: MatDialog) {}

  openDialog(title, message, status, actionURL = null) {
    const dialogRef = this.dialog.open(AlertmodalComponent, {
      autoFocus: true,
      minWidth: '40vw',
      data: {
        title: title,
        message: message,
        status: status,
        actionURL: actionURL,
      },
    });
  }
}
