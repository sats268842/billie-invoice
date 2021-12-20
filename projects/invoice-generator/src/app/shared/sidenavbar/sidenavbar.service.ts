import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavbarService {
  hideSideNav: boolean = false;

  constructor() {}
  private showNav$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  toggleSideNav(): void {
    this.hideSideNav = !this.hideSideNav;
  }
  getShowNav() {
    return this.showNav$.asObservable();
  }

  setShowNav(showHide: boolean) {
    this.showNav$.next(showHide);
  }

  toggleNavState() {
    this.showNav$.next(!this.showNav$.value);
  }

  isNavOpen() {
    if (this.showNav$.value) {
      document.getElementById('side-container').style.width = '0';
    }
    return this.showNav$.value;
  }
}
