import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPurchaseDetailComponent } from './modal-purchase-detail.component';

describe('ModalPurchaseDetailComponent', () => {
  let component: ModalPurchaseDetailComponent;
  let fixture: ComponentFixture<ModalPurchaseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPurchaseDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPurchaseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
