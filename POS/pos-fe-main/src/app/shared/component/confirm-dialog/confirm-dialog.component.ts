import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  // @Input() titleMessage;
  // @Output() isConfirm: EventEmitter<any> = new EventEmitter();
  // message: string;
  // constructor(
  //   public modal: NgbActiveModal,
  // ) {
  //   this.message = '';
  // }

  // ngOnInit(): void {
  //   this.message = this.titleMessage;
  // }

  // onSubmit() {
  //   this.modal.close();
  //   this.isConfirm.emit(true);
  // }
  @Input() title ?: string;
  @Input() message ?: string;
  @Input() btnOkText ?: string;
  @Input() btnCancelText ?: string;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }
}
