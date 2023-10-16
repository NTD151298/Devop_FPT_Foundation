import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryStallsComponent } from './category-stalls.component';

describe('CategoryStallsComponent', () => {
  let component: CategoryStallsComponent;
  let fixture: ComponentFixture<CategoryStallsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryStallsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryStallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
