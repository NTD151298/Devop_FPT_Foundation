import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowbarcodeComponent } from './showbarcode.component';

describe('ShowbarcodeComponent', () => {
  let component: ShowbarcodeComponent;
  let fixture: ComponentFixture<ShowbarcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowbarcodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowbarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
