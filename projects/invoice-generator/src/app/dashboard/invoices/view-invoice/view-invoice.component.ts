import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss'],
})
export class ViewInvoiceComponent implements OnInit {
  @Input() customer: any;
  @Output() onCloseStatus: EventEmitter<boolean> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  onClose() {
    this.onCloseStatus.emit(false);
  }
}
