import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyPriceComponent } from './modify-price.component';

describe('ModifyPriceComponent', () => {
  let component: ModifyPriceComponent;
  let fixture: ComponentFixture<ModifyPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
