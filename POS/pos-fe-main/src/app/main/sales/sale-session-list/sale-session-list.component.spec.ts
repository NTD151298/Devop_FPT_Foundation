import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleSessionListComponent } from './sale-session-list.component';

describe('SaleSessionListComponent', () => {
  let component: SaleSessionListComponent;
  let fixture: ComponentFixture<SaleSessionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleSessionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleSessionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
