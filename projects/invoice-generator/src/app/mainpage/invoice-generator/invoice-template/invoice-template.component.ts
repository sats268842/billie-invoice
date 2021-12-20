import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// import { InvoiceServiceService } from '../invoice-service.service';

@Component({
  selector: 'app-invoice-template',
  templateUrl: './invoice-template.component.html',
  styleUrls: ['./invoice-template.component.scss'],
})
export class InvoiceTemplateComponent implements OnInit {
  constructor() {}
  @Input() invoice: any;

  ngOnInit(): void {
    //   this.invoice = {
    //     "currency": "INR",
    //     "currentDate": "Fri Sep 10 2021 10:51:37 GMT+0530 (India Standard Time)",
    //     "dueDate": "",
    //     "from": {"name": 'Santhosh Thomas', "address": 'Charvuvila Puthen veedu Thuvayoor SOuth P.O.'},
    //     "invoiceID": "##005",
    //     "services": [
    //         {
    //         'id': 1,
    //         'quantity': 2,
    //         'service': 'Software',
    //         'description': 'Software Support Service Description',
    //         'price': '5000'
    //         },
    //          {
    //         'id': 2,
    //         'quantity': 2,
    //         'service': 'Software',
    //         'description': 'Software Support Service Description',
    //         'price': '5000'
    //         }
    //     ],
    //     "tax": 18,
    //     "total": 590,
    //     "to": {"name": 'Client Name', "phone": '9074134303', "email": 'client@gmail.com', "address": 'Charvuvila Puthen veedu Thuvayoor South P.O.'}

    // }
    // this.invoice = this.invoice
    // this.openPDF()
    console.log(this.invoice);
    console.log(document.getElementById('htmlData'));
    // console.log(this.name.nativeElement.innerHTML)
    // this.openPDF()
    // this._service.invoice$.subscribe(
    //   data=>{
    //     // console.log(data)
    //     this.invoice =data
    //     // this.openPDF()
    //   }
    // )
  }
  openPDF(DATA1) {
    // console.log('pdf');
    // console.log(DATA1);

    let DATA = document.getElementById('htmlData');

    html2canvas(DATA).then((canvas) => {
      DATA.style.display = 'none';
      // console.log(this.invoice);
      let fileWidth = 210;
      // let fileHeight = 200;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      // console.log('page height', fileHeight);
      // console.log('canvas height', canvas.height);
      // console.log('page height', fileWidth);
      let pagecount = Math.ceil(fileHeight / fileWidth);
      // console.log(pagecount);
      const FILEURI = canvas.toDataURL('image/png', 1.0);
      // this.image = FILEURI
      // console.log(FILEURI)
      // this._invoiceService.updateInvoiceImage(FILEURI);
      let PDF = new jsPDF('p', 'mm', 'a4', true);
      let position = 5;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      // if (pagecount > 0) {
      //   var j = 1;
      //   while (j != pagecount) {
      //       PDF.addPage('a4');
      //       PDF.addImage(FILEURI, 'PNG', 2, -(j * fileHeight), fileWidth-4, 0);
      //       j++;
      //   }
      // }
      document.body.style.overflow = 'scroll';
      PDF.save(this.invoice.invoiceID + '.pdf');
    });
  }
}
