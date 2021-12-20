import { Platform } from '@angular/cdk/platform';
import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isSticky: boolean = false;
  toggle: boolean = false;
  constructor(public platform: Platform, @Inject(PLATFORM_ID) private platformId: Object) {}
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isSticky = window.pageYOffset >= 50;
    }
  }
  ngOnInit(): void {}

  menuToggle() {
    this.toggle = !this.toggle;
  }
  onClick() {
    this.toggle = false;
  }
}
