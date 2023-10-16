import {
  AfterContentInit,
  Component,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as JsBarcode from 'jsbarcode';
import { ShareStateService } from 'src/app/shared/services/share-state.service';
import { POSServices } from 'src/services/pos/pos.service';
@Component({
  selector: 'app-list-barcode',
  templateUrl: './list-barcode.component.html',
  styleUrls: ['./list-barcode.component.css'],
})
export class ListBarcodeComponent implements OnInit, AfterContentInit {
  listPrint: any[] = [];
  list_clone: any[] = [];

  constructor(
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    public _services: POSServices,
    private shareService: ShareStateService
  ) {}
  ngAfterContentInit() {}

  ngOnInit(): void {
    this.shareService.statePrintTem$.subscribe((e: any) => {
      if (e) {
        this.listPrint = this.paging(e);
        this.list_clone = e;
      } else {
        this._router.navigate([`main/product-print-barcode`]);
      }
    });
    setTimeout(() => {
      this.listPrint.forEach((ele, index) => {
        ele.pageItems.forEach(element => {
          let render = JsBarcode('#barcode' + element.index).options({
            height: 30,
            width: 1,
          });
          let code = ('0' + element.barcode).padEnd(12, '0');
          if (code.length == 12) {
            render.EAN13(code, { fontSize: 18, textMargin: 0 });
          } else {
            render.CODE128(element.barcode, { fontSize: 14, textMargin: 0 });
          }
          render.render();
        });
      });
    }, 200);
    setTimeout(() => {
      if (this.listPrint.length>0) {
        window.print();
      }
    }, 600);
  }

  paging(list){
    let response = [];
    let numberPage = Math.ceil(list.length/15);
    for (let index = 0; index < numberPage; index++) {
      response.push({
        page:index,
        pageItems: list.slice(index * 15).slice(0,15)
      });
    }
    return response;
  }

  @HostListener('window:afterprint')
  onafterprint() {
    this._services.Product().product_warehouse_modify_print_price(this.list_clone.map(e => e.id)).subscribe((res: any) => {
      if (res.statusCode === 200) {
        window.close();
        this._router.navigate(['main/product-print-barcode']);
      }
    })
  }
}
