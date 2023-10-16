import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PaginatorModule } from 'primeng/paginator';
import { NgxPrintModule } from 'ngx-print';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductBarcodePrintComponent } from './product-warehouse/product-barcode-print/product-barcode-print.component';
import { ProductWarehouseListComponent } from './product-warehouse/product-warehouse-list/product-warehouse-list.component';
import { PriceHistoryListComponent } from './product-warehouse/price-history-list/price-history-list.component';
import { ModifyPriceComponent } from './product-warehouse/modify-price/modify-price.component';
import { ProductDetailWarehouseListComponent } from './product-warehouse/product-detail-warehouse-list/product-detail-warehouse-list.component';
import { ProductsCreateComponent } from './products-create/products-create.component';
import { ProductComboListComponent } from './product-combo/product-combo-list/product-combo-list.component';
import { ProductComboDetailComponent } from './product-combo/product-combo-detail/product-combo-detail.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductEditComponent,
    ProductDetailWarehouseListComponent,
    ModifyPriceComponent,
    ProductWarehouseListComponent,
    PriceHistoryListComponent,
    ProductBarcodePrintComponent,
    ProductsCreateComponent,
    ProductComboListComponent,
    ProductComboDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsRoutingModule,
    DropdownModule,
    InputTextModule,
    TableModule,
    PaginatorModule,
    CalendarModule,
    InputTextareaModule,
    TooltipModule,
    CheckboxModule,
    RadioButtonModule,
    SharedModule,
    NgxPrintModule,
    PaginatorModule,
    AutoCompleteModule,
    PaginationModule.forRoot(),
  ],
  exports: [],
})
export class ProductsModule {}
