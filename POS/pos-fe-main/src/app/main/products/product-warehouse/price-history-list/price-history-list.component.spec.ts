import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceHistoryListComponent } from './price-history-list.component';

describe('PriceHistoryListComponent', () => {
  let component: PriceHistoryListComponent;
  let fixture: ComponentFixture<PriceHistoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceHistoryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
