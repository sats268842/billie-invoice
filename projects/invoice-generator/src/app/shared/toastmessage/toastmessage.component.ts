import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
// import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ToasterService } from '../toaster.service';

@Component({
  selector: 'app-toastmessage',
  templateUrl: './toastmessage.component.html',
  styleUrls: ['./toastmessage.component.scss'],
})
export class ToastmessageComponent implements OnInit {
  constructor(private snackbarService: ToasterService) {}

  show = false;
  message: string = 'This is snackbar';
  snackbarSubscription!: Subscription;
  // horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  // verticalPosition: MatSnackBarVerticalPosition = 'top';

  ngOnInit() {
    this.snackbarSubscription = this.snackbarService.snackbarSubject.subscribe((state) => {
      console.log(state);
      if (Object.keys(state).length !== 0) {
        this.message = state.message;
        this.show = state.show;
        // this._snackBar.open(this.message, 'Close', {
        //   duration: 2000,
        //   horizontalPosition: this.horizontalPosition,
        //   verticalPosition: this.verticalPosition,
        // });
      }
    });
  }

  ngOnDestroy() {
    this.snackbarSubscription.unsubscribe();
  }
}
