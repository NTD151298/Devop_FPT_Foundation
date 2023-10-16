import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftRevenueBookReportComponent } from './shift-revenue-book-report.component';

describe('ShiftRevenueBookReportComponent', () => {
  let component: ShiftRevenueBookReportComponent;
  let fixture: ComponentFixture<ShiftRevenueBookReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftRevenueBookReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftRevenueBookReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
