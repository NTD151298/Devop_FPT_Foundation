import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionGoodsByGoodsComponent } from './promotion-goods-by-goods.component';

describe('PromotionGoodsByGoodsComponent', () => {
  let component: PromotionGoodsByGoodsComponent;
  let fixture: ComponentFixture<PromotionGoodsByGoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromotionGoodsByGoodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionGoodsByGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
