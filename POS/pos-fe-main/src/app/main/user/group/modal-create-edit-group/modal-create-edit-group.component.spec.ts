import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateEditGroupComponent } from './modal-create-edit-group.component';

describe('ModalCreateEditGroupComponent', () => {
  let component: ModalCreateEditGroupComponent;
  let fixture: ComponentFixture<ModalCreateEditGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCreateEditGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateEditGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
