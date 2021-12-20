import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoaderComponent implements OnInit {

  constructor( @Inject(DOCUMENT) private document: Document, private render: Renderer2) { }

  ngOnInit(): void {

  }
  ngOnDestroy() {
   
  }
}
