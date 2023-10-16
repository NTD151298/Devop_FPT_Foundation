import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionByReceiptComponent } from './promotion-by-receipt.component';

describe('PromotionByReceiptComponent', () => {
  let component: PromotionByReceiptComponent;
  let fixture: ComponentFixture<PromotionByReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromotionByReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionByReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
