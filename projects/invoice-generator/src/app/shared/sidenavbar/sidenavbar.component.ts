import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthServiceService } from 'src/app/auth/auth-service.service';

import { SidenavbarService } from './sidenavbar.service';
export enum SideNavDirection {
  Left = 'left',
  Right = 'right',
}
@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrls: ['./sidenavbar.component.scss'],
})
export class SidenavbarComponent implements OnInit {
  @Input() sidenavTemplateRef: any;
  @Input() duration: number = 0.25;

  // @Input() navWidth: number = window.innerWidth;
  @Input() direction: SideNavDirection = SideNavDirection.Left;

  constructor(public authService: AuthServiceService, public sideNavService: SidenavbarService) {}
  user: any;
  sidenavbarLink = [
    {
      name: 'Home',
      icon: 'home-outline',
      link: './',
    },
    {
      name: 'Invoice',
      icon: 'folder-open-outline',
      link: 'invoices',
    },
    {
      name: 'customers',
      icon: 'people-outline',
      link: 'customers',
    },
    {
      name: 'Settings',
      icon: 'settings-outline',
      link: 'settings',
    },
  ];

  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      this.user = user;
    });
  }

  signOut() {
    this.authService.SignOut();
  }
}
