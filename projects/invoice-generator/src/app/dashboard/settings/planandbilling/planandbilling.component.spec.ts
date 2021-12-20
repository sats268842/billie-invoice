import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanandbillingComponent } from './planandbilling.component';

describe('PlanandbillingComponent', () => {
  let component: PlanandbillingComponent;
  let fixture: ComponentFixture<PlanandbillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanandbillingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanandbillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
