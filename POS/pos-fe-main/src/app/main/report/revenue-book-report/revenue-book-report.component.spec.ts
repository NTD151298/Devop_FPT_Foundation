import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueBookReportComponent } from './revenue-book-report.component';

describe('RevenueBookReportComponent', () => {
  let component: RevenueBookReportComponent;
  let fixture: ComponentFixture<RevenueBookReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevenueBookReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueBookReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
