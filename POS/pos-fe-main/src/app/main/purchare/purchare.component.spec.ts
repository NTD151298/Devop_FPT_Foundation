import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchareComponent } from './purchare.component';

describe('PurchareComponent', () => {
  let component: PurchareComponent;
  let fixture: ComponentFixture<PurchareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
