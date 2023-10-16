import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Configuration } from '../common/configuration';

@Injectable({
  providedIn: 'root'
})
export class POSServices {
  constructor(
    public http: HttpClient,
    private config: Configuration,
  ) { }

  GetListProduct(model: any) {
    let url = `${this.config.ApiUrl}product/product-warehouse-list?category_code=${model.category
      }&page_size=${model.size}&page_number=${model.currentPage}&warehouse_id=${model.warehouse_id}`;
    return this.http.get(url, { params: { keyword: model.keyword } });
  }
  GetListProductCombo(model: any) {
    let url = `${this.config.ApiUrl}product/product-warehouse-list2?category_code=${model.category
      }&page_size=${model.size}&page_number=${model.currentPage}&warehouse_id=${model.warehouse_id}`;
    return this.http.get(url, { params: { keyword: model.keyword } });
  }

  GetProductBarcode(model: any) {
    return this.http.get(`${this.config.ApiUrl}product/product-warehouse-barcode?barcode=${model.keyword
      }&warehouse_id=${model.warehouse_id}`);
  }

  GetListCustomers(model: any) {
    return this.http.get(`${this.config.ApiUrl}customer/list?page_number=${model.currentPage}&page_size=${model.size
      }&keyword=${model.keyword}`);
  }

  CreateOrder(model: any) {
    return this.http.post(`${this.config.ApiUrl}order/create`, model);
  }

  CreateCustomer(model: any) {
    return this.http.post(`${this.config.ApiUrl}customer/create`, model);
  }

  GetListVouchers(model: any) {
    return this.http.post(`${this.config.ApiUrl}voucher/list`, model);
  }
  GetListBankAccount() {
    return this.http.get(`${this.config.ApiUrl}bank-account/list`);
  }

  Order() {
    return {
      getList: (model: any) => {
        return this.http.post(`${this.config.ApiUrl}order/list`, model);
      },
      getDetail: (model: any) => {
        return this.http.get(`${this.config.ApiUrl}order/detail?id=${model}`);
      }
    }
  }
  Refund() {
    let url = this.config.ApiUrl + 'refund/'
    return {
      getList: (model: any) => {
        return this.http.post(`${url}list`, model);
      },
      getDetail: (model: any) => {
        return this.http.get(`${url}detail?id=${model}`);
      },
      add: (model: any) => {
        return this.http.post(`${url}create`, model);
      },
      getListOrder: (model: any) => {
        return this.http.get(`${url}list-order?keyword=${model.keyword}&warehouse_id=${model.warehouse_id
          }`);
      },
      checkOrder: (model: any) => {
        return this.http.post(`${url}check-order`, model);
      },

    }
  }

  Purchase() {
    let url = this.config.ApiUrl + 'purchase/'
    return {
      getList: (data: any) => {
        return this.http.get(`${url}purchase-list?keyword=${data.keyword}&page_size=${data.page_size}&page_number=${data.page_number}&status_id=${data.status_id}&start_date=${data.start_date}&end_date=${data.end_date}`)
      },
      getList2: (data: any) => {
        return this.http.get(`${url}purchase-list?keyword=${data.keyword}&page_size=${data.page_size}&page_number=${data.page_number}&status_id=${data.status_id}&start_date=${data.start_date}&end_date=${data.end_date}`)
      },
      get: (id: any) => {
        return this.http.get(`${url}purchase?id=${id}`)
      },
      add: (data: any) => {
        return this.http.post(`${url}purchase-create`, data)
      },
      edit: (data: any) => {
        return this.http.post(`${url}purchase-modify`, data)
      },
      delete: (id: any) => {
        return this.http.delete(`${url}purchase-delete?id=${id}`)
      },
      quantityInventory: (data: any) => {
        return this.http.get(`${url}quantity-inventory?warehouse_id=${data.warehouse_id}&product_id=${data.product_id}`)
      }

    }
  }

  Promotion() {
    let url = this.config.ApiUrl + 'Promotion'
    return {
      getList: (data: any) => {
        return this.http.post(`${url}/list`, data)
      },
      get: (id: any) => {
        return this.http.get(`${url}/detail?id=${id}`)
      },
      add: (data: any) => {
        return this.http.post(`${url}/create`, data)
      },
      edit: (data: any) => {
        return this.http.post(`${url}/modify`, data)
      },
    }
  }

  Product() {
    let url = this.config.ApiUrl + 'product/'
    return {
      getList: (data: any) => {
        // console.log(`${url}product-list?keyword=${data.keyword}&category_code=${data.category_code}&page_size=${data.page_size}&page_number=${data.page_number}`)
        return this.http.post(`${url}product-list`, data)
      },
      getOpt: () => {
        return this.http.post(`${url}product-list`, { keyword: '', category_code: '', page_size: 20, page_number: 0 })
      },
      getProductRequestWarehouseList: (data) => {
        return this.http.get(`${url}product-request-warehouse-list?page_number=${data.page_number}&page_size=${data.page_size
          }&keyword=${data.keyword}&warehouse_id=${data.warehouse_id}`);
      },
      get: (id: any) => {
        return this.http.get(`${url}product?id=${id}`)
      },
      add: (data: any) => {
        return this.http.post(`${url}product-create`, data)
      },
      edit: (data: any) => {
        return this.http.post(`${url}product-modify`, data)
      },
      delete: (id: any) => {
        // console.log(`${url}product-delete?id=${id}`)
        return this.http.delete(`${url}product-delete?product_id=${id}`)
      },
      product_warehouse_modify_print_barcode: (data: any) => {
        return this.http.post(`${url}product-warehouse-modify-print-barcode`, data)
      },
      product_warehouse_modify_print_price: (data: any) => {
        return this.http.post(`${url}product-warehouse-modify-print-price`, data)
      },
      product_detail_warehouse_list: (data: any) => {
        return this.http.post(`${url}product-detail-warehouse-list`, data);
      },
      product_warehouse_modify: (data: any) => {
        return this.http.post(`${url}product-warehouse-modify`, data)
      },
      product_change_price_history_list: (data: any) => {
        return this.http.post(`${url}product-change-price-history-list`, data)
      },
      get_listDetai: (product_id: number) => {
        return this.http.get(`${url}get-product-partner-by-product?product_id=${product_id}`)
      },



      getListCombo: (data: any) => {
        // console.log(`${url}product-list?keyword=${data.keyword}&category_code=${data.category_code}&page_size=${data.page_size}&page_number=${data.page_number}`)
        return this.http.post(`${url}combo-list`, data)
      },
      add_listDetai: (data: any) => {
        return this.http.post(`${url}product-partner-create`, data)
      },
      edit_listDetai: (data: any) => {
        return this.http.post(`${url}product-partner-update`, data)
      },
      get_combo_detail: (combo_id: any) => {
        return this.http.get(`${url}combo-detail?combo_id=${combo_id}`)
      },
      add_product_combo: (data: any) => {
        return this.http.post(`${url}combo-create`, data)
      },
      edit_product_combo: (data: any) => {
        return this.http.post(`${url}combo-update`, data)
      },
      get_product_request_warehouse: (partner_id: number, warehouse_id: number) => {
        return this.http.get(`${url}product-request-warehouse-list2?partner_id=${partner_id}&warehouse_id=${warehouse_id}`)
      },
    }
  }

  Warehouse() {
    let url = this.config.ApiUrl + 'warehouse/'
    return {
      getList: (data: any) => {
        return this.http.post(`${url}list`, data)
      },
      getOpt: () => {
        return this.http.get(`${url}user-warehouse-list`)
      },
      get: (id: any) => {
        return this.http.get(`${url}detail?id=${id}`)
      },
      add: (data: any) => {
        return this.http.post(`${url}create`, data)
      },
      edit: (data: any) => {
        return this.http.post(`${url}modify`, data)
      }
    }
  }

  Partner() {
    let url = this.config.ApiUrl + 'partner/';
    let url_product = this.config.ApiUrl + 'product/';
    return {
      getList: (data: any) => {
        return this.http.post(`${url}list`, data);
      },
      getOpt: () => {
        let data: any = {
          keyword: '',
          page_size: 20,
          page_number: 0
        }
        return this.http.post(`${url}list`, data)
      },
      get: (id: any) => {
        return this.http.get(`${url}detail?id=${id}`)
      },
      add: (data: any) => {
        return this.http.post(`${url}create`, data)
      },
      edit: (data: any) => {
        return this.http.post(`${url}modify`, data)
      },
      get_listDetai: (partner_id: number, keyword: string) => {
        return this.http.get(`${url_product}get-product-partner-by-partner?partner_id=${partner_id}&keyword=${keyword}`)
      },
      add_listDetai: (data: any) => {
        return this.http.post(`${url_product}product-partner-create`, data)
      },
      edit_listDetai: (data: any) => {
        return this.http.post(`${url_product}product-partner-update`, data)
      }
    }
  }

  Customer() {
    let url = this.config.ApiUrl + 'customer/'
    return {
      getList: (data: any) => {
        return this.http.post(`${url}list`, data)
      },
      getOpt: () => {
        return this.http.post(`${url}list?page_size=20&page_number=0`, '')
      },
      get: (id: any) => {
        return this.http.get(`${url}detail?id=${id}`)
      },
      add: (data: any) => {
        return this.http.post(`${url}create`, data)
      },
      edit: (data: any) => {
        return this.http.post(`${url}modify`, data)
      }
    }
  }

  Category() {
    let url = this.config.ApiUrl + 'category/category-'
    return {
      Product: () => {
        url += 'product'
        return {
          getList: (data: any) => {
            // console.log(`${url}-list?keyword=${data.keyword}&page_size=${data.page_size}&page_number=${data.page_number}`)
            return this.http.get(`${url}-list?keyword=${data.keyword}&page_size=${data.page_size}&page_number=${data.page_number}`)
          },
          getOpt: () => {
            return this.http.get(`${url}-list?keyword=&page_size=20&page_number=0`)
          },
          get: (id: any) => {
            return this.http.get(`${url}?id=${id}`)
          },
          add: (data: any) => {
            return this.http.post(`${url}-create`, data)
          },
          edit: (data: any) => {
            return this.http.post(`${url}-modify`, data)
          },
          delete: (id: any) => {
            return this.http.delete(`${url}-delete?category_id=${id}`)
          }
        }
      },
      Stalls: () => {
        url += 'stalls'
        return {
          getList: (data: any) => {
            return this.http.get(`${url}-list?keyword=${data.keyword}&category_id=${data.category_id}`)
          },
          getOpt: (data: any) => {
            return this.http.get(`${url}-list?keyword=&category_id=${data.category_id}`)
          },
          get: (id: any) => {
            return this.http.get(`${url}?id=${id}`)
          },
          add: (data: any) => {
            return this.http.post(`${url}-create`, data)
          },
          edit: (data: any) => {
            return this.http.post(`${url}-modify`, data)
          },
          delete: (id: any) => {
            return this.http.delete(`${url}-delete?category_id=${id}`)
          }
        }
      },
      Group: () => {
        url += 'group'
        return {
          getList: (data: any) => {
            return this.http.get(`${url}-list?keyword=${data.keyword}&category_id=${data.category_id || 0}&stalls_id=${data.stalls_id || 0}`)
          },
          getOpt: (data) => {
            return this.http.get(`${url}-list?keyword=&category_id=${data.category_id}&stalls_id=${data.stalls_id}`)
          },
          get: (id: any) => {
            return this.http.get(`${url}?id=${id}`)
          },
          add: (data: any) => {
            return this.http.post(`${url}-create`, data)
          },
          edit: (data: any) => {
            return this.http.post(`${url}-modify`, data)
          },
          delete: (id: any) => {
            return this.http.delete(`${url}-delete?category_id=${id}`)
          }
        }
      },
      Unit: () => {
        url += 'unit'
        return {
          getList: (data: any) => {
            return this.http.get(`${url}-list?keyword=${data.keyword}&page_size=${data.page_size}&page_number=${data.page_number}`)
          },
          getOpt: () => {
            return this.http.get(`${url}-list?keyword=&page_size=20&page_number=0`)
          },
          get: (id: any) => {
            return this.http.get(`${url}?id=${id}`)
          },
          add: (data: any) => {
            return this.http.post(`${url}-create`, data)
          },
          edit: (data: any) => {
            return this.http.post(`${url}-modify`, data)
          },
          delete: (id: any) => {
            return this.http.delete(`${url}-delete?category_id=${id}`)
          }
        }
      },
      Packing: () => {
        url += 'packing'
        return {
          getList: (data: any) => {
            return this.http.get(`${url}-list?keyword=${data.keyword}&page_size=${data.page_size}&page_number=${data.page_number}`)
          },
          getOpt: () => {
            return this.http.get(`${url}-list?keyword=&page_size=20&page_number=0`)
          },
          get: (id: any) => {
            return this.http.get(`${url}?id=${id}`)
          },
          add: (data: any) => {
            return this.http.post(`${url}-create`, data)
          },
          edit: (data: any) => {
            return this.http.post(`${url}-modify`, data)
          },
          delete: (id: any) => {
            return this.http.delete(`${url}-delete?category_id=${id}`)
          }
        }
      },
    }
  }
  WarehouseReceipt() {
    let url = this.config.ApiUrl + 'warehouse-receipt/';
    return {
      getList: (data: any) => {
        return this.http.post(`${url}list`, data)
      },
      get: (id: any) => {
        return this.http.get(`${url}detail?id=${id}`)
      },
      add: (data: any) => {
        return this.http.post(`${url}create`, data)
      },
      edit: (data: any) => {
        return this.http.post(`${url}modify`, data)
      },
      delete: (id: any) => {
        return this.http.get(`${url}delete?category_id=${id}`)
      },
      print: (id: any) => {
        return this.http.get(`${url}print?id=${id}`)
      }
    }
  }
  WarehouseExport() {
    let url = this.config.ApiUrl + 'warehouse-export/';
    return {
      getList: (data: any) => {
        return this.http.get(`${url}list?partner_id=${data.partner_id}&warehouse_id=${data.warehouse_id}&status_id=${data.status_id}&keyword=${data.keyword}&page_number=${data.page_number}&page_size=${data.page_size}&start_date=${data.start_date}&end_date=${data.end_date}`)
      },
      get: (id: any) => {
        return this.http.get(`${url}detail?id=${id}`)
      },
      add: (data: any) => {
        return this.http.post(`${url}create`, data)
      },
      edit: (data: any) => {
        return this.http.post(`${url}modify`, data)
      },
      delete: (id: any) => {
        return this.http.get(`${url}delete?id=${id}`)
      },
      approve: (id: any) => {
        return this.http.get(`${url}approve?id=${id}`)
      },
      confirm: (id: any) => {
        return this.http.get(`${url}confirm?id=${id}`)
      },
      print: (id: any) => {
        return this.http.get(`${url}print?id=${id}`)
      },
    }
  }
  WarehouseRequest() {
    let url = this.config.ApiUrl + 'warehouse-request/';
    return {
      getList: (data: any) => {
        return this.http.post(`${url}list`, data)
      },
      get: (id: any) => {
        return this.http.get(`${url}detail?id=${id}`)
      },
      add: (data: any) => {
        return this.http.post(`${url}create`, data)
      },
      edit: (data: any) => {
        return this.http.post(`${url}modify`, data)
      },
      statusModify: (data: any) => {
        return this.http.get(`${url}modify-status?id=${data.id}&status=${data.status}`)
      },
      delete: (id: any) => {
        return this.http.get(`${url}delete?id=${id}`)
      }
    }
  }
  SaleSession() {
    let url = this.config.ApiUrl + 'sale-session/';
    return {
      getList: (data: any) => {
        return this.http.post(`${url}list`, data);
      },
      create: (data: any) => {
        return this.http.post(`${url}create`, data);
      },
      modify: (data: any) => {
        return this.http.post(`${url}modify`, data);
      },
      getInfo: (data: any) => {
        return this.http.get(`${url}detail?id=${data}`);
      },
      getIdCurrent: () => {
        return this.http.get(`${url}id-current`);
      }

    }
  }

  Voucher() {
    let url = this.config.ApiUrl + 'voucher/'
    return {
      getList: (data: any) => {
        return this.http.post(`${url}list`, data);
      },
      get: (id: any) => {
        return this.http.get(`${url}detail?id=${id}`);
      },
      add: (data: any) => {
        return this.http.post(`${url}create`, data);
      },
      edit: (data: any) => {
        return this.http.post(`${url}modify`, data);
      },
      delete: (id: any) => {
        return this.http.get(`${url}delete?id=${id}`);
      }
    }
  }
  Report() {
    let url = this.config.ApiUrl + 'report/'
    return {
      getRevenueProductsList: (data: any) => {
        return this.http.post(`${url}revenue-products`, data)
      },
      getInOutInventoryProducts: (data: any) => {
        return this.http.post(`${url}in-out-products`, data)
      },
      getInventoryHistoryProduct: (data: any) => {
        return this.http.post(`${url}history-inventory-product`, data)
      },
      getDailyImportPproduct: (start_date: Date, end_date: Date, warehouse_id: number, type: number) => {
        return this.http.get(`${url}daily-import-product?start_date=${start_date}&end_date=${end_date}&warehouse_id=${warehouse_id}&type=${type}`)
      },
      getDailyExportPproduct: (start_date: Date, end_date: Date, warehouse_id: number, type: number) => {
        return this.http.get(`${url}daily-export-product?start_date=${start_date}&end_date=${end_date}&warehouse_id=${warehouse_id}&type=${type}`)
      },
      getOrderExport: (start_date: Date, end_date: Date, warehouse_id: number) => {
        return this.http.get(`${url}order-export?start_date=${start_date}&end_date=${end_date}&warehouse_id=${warehouse_id}`)
      },
      getSessionExport: (start_date: Date, end_date: Date, warehouse_id: number) => {
        return this.http.get(`${url}session-export?start_date=${start_date}&end_date=${end_date}&warehouse_id=${warehouse_id}`)
      },
    }
  }

  Dasboard() {
    let url = this.config.ApiUrl + 'dasboard/'
    return {
      getInfo: (data: any) => {
        return this.http.get(`${url}info?id=${data}`)
      },
      getRevenue: (data: any) => {
        return this.http.post(`${url}revenue-chart`, data)
      },
      getTopProduct: (data: any) => {
        return this.http.post(`${url}top-product-chart`, data)
      },
    }
  }
  WarehouseInventory() {
    let url = this.config.ApiUrl + 'warehouse-inventory/';
    return {
      getList: (data: any) => {
        return this.http.post(`${url}list`, data)
      },
      get: (id: any) => {
        return this.http.get(`${url}detail?id=${id}`)
      },
      add: (data: any) => {
        return this.http.post(`${url}create`, data)
      },
      edit: (data: any) => {
        return this.http.post(`${url}modify`, data)
      },
      delete: (id: any) => {
        return this.http.delete(`${url}delete?id=${id}`)
      },
      approve: (id: any) => {
        return this.http.get(`${url}approve?id=${id}`)
      },
      reject: (id: any) => {
        return this.http.get(`${url}reject?id=${id}`)
      },
      print: (id: any) => {
        return this.http.get(`${url}print?id=${id}`)
      }
    }
  }

  Contract() {
    let url = this.config.ApiPms + 'contract/'
    return {
      getList: (data: any) => {
        return this.http.get(`${url}list?page_size=${data.page_size || 15}&page_number=${data.page_number || 0}&keyword=${data.keyword || ""}`)
      },
      get: (id: any) => {
        return this.http.get(`${url}contract?id=${id}`);
      },
      add: (data: any) => {
        return this.http.post(`${url}create`, data);
      },
      edit: (data: any) => {
        return this.http.post(`${url}modify`, data);
      },
      delete: (id: any) => {
        return this.http.delete(`${url}delete?id=${id}`);
      }
    }
  }

}
