import { Component, OnInit, Input } from '@angular/core';
import * as JsBarcode from 'jsbarcode';
@Component({
  selector: 'app-showbarcode1',
  templateUrl: './showbarcode.component.html',
  styleUrls: ['./showbarcode.component.css']
})
export class ShowbarcodeComponent implements OnInit {
  @Input() qr_code_image = "";
  @Input() qr_code = "";

  constructor() { }

  ngOnInit(): void {
    // console.log(this.qr_code_image);
    // let render = JsBarcode(".barcode");
    // let cc:any= render.EAN13(('0' + this.qr_code_image).padEnd(12, '0'));
    // console.log(cc);
    // console.log(this.qr_code_image);
    // this.qr_code_image = cc._encodings[5].text
    JsBarcode(".barcode").init();    
  }

}
