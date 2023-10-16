import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateEditRoleGroupComponent } from './modal-create-edit-role-group.component';

describe('ModalCreateEditRoleGroupComponent', () => {
  let component: ModalCreateEditRoleGroupComponent;
  let fixture: ComponentFixture<ModalCreateEditRoleGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCreateEditRoleGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateEditRoleGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
