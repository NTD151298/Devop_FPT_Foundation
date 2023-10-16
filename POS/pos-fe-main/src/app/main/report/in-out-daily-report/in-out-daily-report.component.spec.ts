import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InOutDailyReportComponent } from './in-out-daily-report.component';

describe('InOutDailyReportComponent', () => {
  let component: InOutDailyReportComponent;
  let fixture: ComponentFixture<InOutDailyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InOutDailyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InOutDailyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
