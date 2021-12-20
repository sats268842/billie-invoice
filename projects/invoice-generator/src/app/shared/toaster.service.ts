import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, Subject } from 'rxjs';
// import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  snackbarSubject = new BehaviorSubject<any>({});
  // snackbarState = this.snackbarSubject.asObservable();
  constructor(private toastService: HotToastService) { }


  // show(message: string, type?: string) {
  //   this.snackbarSubject.next({ 
  //     show: true,
  //     message,
  //     type
  //   });
    
  //     console.log(this.snackbarSubject.getValue())
    
  //   }
  showToast(message) {
    this.toastService.show(message)
  }

  showErrorToast(message) {
    this.toastService.error(message)
  }
  showSuccessToast(message) {
    this.toastService.success(message)
  }
}
