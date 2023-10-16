import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateEditGroupRoleComponent } from './modal-create-edit-group-role.component';

describe('ModalCreateEditGroupRoleComponent', () => {
  let component: ModalCreateEditGroupRoleComponent;
  let fixture: ComponentFixture<ModalCreateEditGroupRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCreateEditGroupRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateEditGroupRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
