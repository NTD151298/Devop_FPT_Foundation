import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateEditComponent } from './modal-create-edit.component';

describe('ModalCreateEditComponent', () => {
  let component: ModalCreateEditComponent;
  let fixture: ComponentFixture<ModalCreateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCreateEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
