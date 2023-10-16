import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionByGoodsComponent } from './promotion-by-goods/promotion-by-goods.component';
import { PromotionByReceiptComponent } from './promotion-by-receipt/promotion-by-receipt.component';
import { PromotionGoodsByGoodsComponent } from './promotion-goods-by-goods/promotion-goods-by-goods.component';
import { PromotionListComponent } from './promotion-list/promotion-list.component';

const routes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: 'promotion-list',
          component: PromotionListComponent,
        },
        {
          path: 'promotion-by-goods',
          component: PromotionByGoodsComponent,
        },
        {
          path: 'promotion-by-receipt',
          component: PromotionByReceiptComponent,
        },
        {
          path: 'promotion-goods-by-goods',
          component: PromotionGoodsByGoodsComponent,
        },
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }
