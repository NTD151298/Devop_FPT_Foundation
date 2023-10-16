import { Component, OnInit } from '@angular/core';
import * as JsBarcode from 'jsbarcode';
import { ToastrService } from 'ngx-toastr';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-print-code',
  templateUrl: './print-code.component.html',
  styleUrls: ['./print-code.component.css'],
})
export class PrintCodeComponent implements OnInit {
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _services: POSServices,
    private _toastr: ToastrService
  ) {}

  number: number = 0;

  array: any[] = [];

  hidden_btn: boolean = true;

  ngOnInit(): void {
    // JsBarcode(".barcode").init();
  }

  ceateBarcode() {
    this.array = [];
    if (!this.number || this.number == 0) {
      return;
    }
    let ix = 0;
    this.config.data.forEach((e, i) => {
      for (let index = 0; index < this.number; index++) {
        ix++;
        this.array.push({
          index: ix,
          barcode: e.barcode,
          name: e.name.length > 26 ? e.name.slice(0, 25) : e.name,
          price: e.price,
        });
      }
    });
    setTimeout(() => {
      this.array.forEach((element, index) => {
        let render = JsBarcode('#barcode' + element.index).options({
          height: 40,
          width: 1.5,
        });
        render.init();
        for (let index = 0; index < 3; index++) {
          let code = ('0' + element.barcode).padEnd(12, '0');
          if (code.length > 12) {
            render.
            CODE128(element.barcode, {
              fontSize: 18,
              textMargin: 0,
              marginTop: 20,
              width:1.4
            }).blank(12);
          } else {
            render
              .EAN13(code, {
                fontSize: 18,
                textMargin: 0,
                marginTop: 25,
              })
              .blank(23);
          }
        }
        render.render();
      });
      this.hidden_btn = false;
    }, 500);
  }

  updatePrintModal() {
    this._services
      .Product()
      .product_warehouse_modify_print_barcode(this.config.data.map((e) => e.id))
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this._toastr.success(res.message);
        } else {
          this._toastr.error(res.message);
        }
        this.ref.close();
      });
  }
}
