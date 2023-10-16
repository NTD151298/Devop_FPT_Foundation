import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateEditGroupUserComponent } from './modal-create-edit-group-user.component';

describe('ModalCreateEditGroupUserComponent', () => {
  let component: ModalCreateEditGroupUserComponent;
  let fixture: ComponentFixture<ModalCreateEditGroupUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCreateEditGroupUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateEditGroupUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
