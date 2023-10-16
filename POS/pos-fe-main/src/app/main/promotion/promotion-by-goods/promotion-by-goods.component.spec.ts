import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionByGoodsComponent } from './promotion-by-goods.component';

describe('PromotionByGoodsComponent', () => {
  let component: PromotionByGoodsComponent;
  let fixture: ComponentFixture<PromotionByGoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromotionByGoodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionByGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
