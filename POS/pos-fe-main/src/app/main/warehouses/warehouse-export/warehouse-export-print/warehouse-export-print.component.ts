import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/services/auth/auth.service';

@Component({
  selector: 'app-warehouse-export-print',
  templateUrl: './warehouse-export-print.component.html',
  styleUrls: ['./warehouse-export-print.component.css']
})
export class WarehouseExportPrintComponent implements OnInit {

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
