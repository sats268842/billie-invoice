import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-alertmodal',
  templateUrl: './alertmodal.component.html',
  styleUrls: ['./alertmodal.component.scss'],
})
export class AlertmodalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
