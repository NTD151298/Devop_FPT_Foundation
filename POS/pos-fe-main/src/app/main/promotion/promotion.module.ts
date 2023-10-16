import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { PromotionRoutingModule } from './promotion-routing.module';
import { PromotionByGoodsComponent } from './promotion-by-goods/promotion-by-goods.component';
import { PromotionByReceiptComponent } from './promotion-by-receipt/promotion-by-receipt.component';
import { PromotionGoodsByGoodsComponent } from './promotion-goods-by-goods/promotion-goods-by-goods.component';
import { PromotionListComponent } from './promotion-list/promotion-list.component';
import { TabViewModule } from 'primeng/tabview';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CheckboxModule} from 'primeng/checkbox';

@NgModule({
  declarations: [
    PromotionByGoodsComponent,
    PromotionByReceiptComponent,
    PromotionGoodsByGoodsComponent,
    PromotionListComponent
  ],
  imports: [
    CommonModule,
    CheckboxModule,
    InputTextareaModule,
    PromotionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    TabViewModule,
    NgbDatepickerModule,
    PaginationModule.forRoot(),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
})
export class PromotionModule { }
