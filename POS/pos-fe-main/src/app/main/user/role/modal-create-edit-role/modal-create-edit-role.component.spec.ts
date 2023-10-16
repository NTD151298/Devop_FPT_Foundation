import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateEditRoleComponent } from './modal-create-edit-role.component';

describe('ModalCreateEditRoleComponent', () => {
  let component: ModalCreateEditRoleComponent;
  let fixture: ComponentFixture<ModalCreateEditRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCreateEditRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateEditRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
