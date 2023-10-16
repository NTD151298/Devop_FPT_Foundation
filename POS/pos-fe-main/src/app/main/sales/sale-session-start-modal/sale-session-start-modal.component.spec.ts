import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleSessionStartModalComponent } from './sale-session-start-modal.component';

describe('SaleSessionStartModalComponent', () => {
  let component: SaleSessionStartModalComponent;
  let fixture: ComponentFixture<SaleSessionStartModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleSessionStartModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleSessionStartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
