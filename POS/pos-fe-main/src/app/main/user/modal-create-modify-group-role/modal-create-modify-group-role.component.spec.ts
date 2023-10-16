import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateModifyGroupRoleComponent } from './modal-create-modify-group-role.component';

describe('ModalCreateModifyGroupRoleComponent', () => {
  let component: ModalCreateModifyGroupRoleComponent;
  let fixture: ComponentFixture<ModalCreateModifyGroupRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCreateModifyGroupRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateModifyGroupRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
