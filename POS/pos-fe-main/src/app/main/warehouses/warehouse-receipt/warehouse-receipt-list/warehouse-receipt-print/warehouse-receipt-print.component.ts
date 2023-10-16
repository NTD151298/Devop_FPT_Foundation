import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-warehouse-receipt-print',
  templateUrl: './warehouse-receipt-print.component.html',
  styleUrls: ['./warehouse-receipt-print.component.css']
})
export class WarehouseReceiptPrintComponent implements OnInit {

  @ViewChild('printBtn') printBtn!: ElementRef;

  @Input() modelPrint: any = {};

  dateNow: Date = new Date();

  ngOnInit(): void {}

  ngOnChanges(changes) {
    if (this.printBtn) {
      setTimeout(() => {
        this.printBtn.nativeElement.click();
      }, 500);
    }
  }

}
