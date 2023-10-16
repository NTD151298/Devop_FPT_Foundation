import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBarcodePrintComponent } from './product-barcode-print.component';

describe('ProductBarcodePrintComponent', () => {
  let component: ProductBarcodePrintComponent;
  let fixture: ComponentFixture<ProductBarcodePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductBarcodePrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBarcodePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
