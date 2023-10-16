
export enum TokenEnum {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
}

export class StorageOption {
  public static Cookie = 'Cookie';
  public static LocalStorage = 'LocalStorage';
}

export class Constant {
  public static SessionId = 'SessionId';
  public static LANG_ID = 'lang';
  public static AppResource = {
    //#region Common
    ACTION_SUCCESS: 'Success!',
    NOT_FIND_DATA: 'No data! Please retry again.',
    ADD_SUCCESS: 'Create successfully!',
    UPDATE_SUCCESS: 'Update successfully!',
    EXCEPTION_UNKNOWN: 'Unknown exception!',
    NOT_FOUND: 'Not found in System!',
    UNAUTHORIZE: 'Unthorize! No right.',
    WARNING_UPDATING: 'Warning! This function is updating.',
    //#endregion
  };

  public static DateFormat = 'DD/MM/YYYY';
}

export class AppStatusCode {
  public static StatusCode200 = 200;
  public static StatusCode201 = 201;
  public static StatusCode400 = 400;
  public static StatusCode401 = 401;
  public static StatusCode422 = 422;
  public static StatusCode500 = 500;
}

export class PagingConstant {
  public static page_number = 0;
  public static page_size = 10;
}

export class StatusConstant {
  public static Active = 1;
  public static DeActive = 0;
}
export class LockConstant {
  public static Lock: number = 0;
  public static Unlock: number = 1;
}
export class ShopType {
  public static ShopThuong = 0;
  public static ShopTruyXuat = 1;
}

export class CategoryStatus {
  public static Category_Bank = 1;
  public static Category_Certificates = 2;
  public static Category_Language = 3;
  public static Category_Packing = 4;
  public static Category_Product = 5;
  public static Category_Province = 6;
  public static Category_Standard = 7;
  public static Category_District = 8;
  public static Category_Unit = 9;
  public static Category_Ward = 1;
  public static Shop_Product = 11;
  public static Category_Area = 12;
  public static Category_Nation = 13;
  public static Category_Link = 13;
  public static RequestShop = 14;
  public static Category_Shipping_Unit = 17;
  public static Banner = 19;
}

export class DisplayProduct {
  public static DisplayHome = 1;
  public static DisplayCategory = 2;
  public static LockOrder = 3;
  public static LockSearch = 4;
}

export const registration_status = [{
  id: 0,
  name: "Sắp diễn ra"
}, {
  id: 1,
  name: "Đang diễn ra"
}, {
  id: 2,
  name: "Đã kết thúc"
}]

export const discount_type = [{
  id: 0,
  name: "Discount %"
}, {
  id: 1,
  name: "Discount theo giá cuối"
}, {
  id: 2,
  name: "Đồng giá (min_discount = max_discount)"
}]

export const sale_status = [{
  id: 0,
  name: "Kích hoạt"
}, {
  id: 1,
  name: "Tạm dừng"
}]

export const TypeWarehouse = [
  {
    id: 1,
    name: "Kho smartgap"
  },
  {
    id: 0,
    name: "Kho hàng hủy"
  }
]

export const statusPurchase = [
  {
    id: 0,
    name: "Chưa xử lý"
  },
  {
    id: 1,
    name: "Đồng ý"
  },
  {
    id: 2,
    name: "Từ chối"
  }
]


export const statusWarehouseRequest = [
  {
    id: 0,
    name: "Chưa xử lý"
  },
  {
    id: 1,
    name: "Đồng ý"
  },
  {
    id: 2,
    name: "Từ chối"
  },
  {
    id: 3,
    name: "Hàng đã về kho"
  }
]


export const TypePurchase = [
  { id: 0, name: 'Phiếu mua hàng' },
  { id: 1, name: 'Phiếu ký gửi hàng' }
];

export const paymentStatusPurchase = [
  { id: 0, name: 'Chưa thánh toán' },
  { id: 1, name: 'Đã thanh toán một phần' },
  { id: 2, name: 'Đã thanh toán toàn bộ' },
];

export const typeContract = [
  {
    id: 1,
    name: "Hợp đồng thương mại"
  },
  {
    id: 2,
    name: "Hợp đồng ký gửi"
  },
]

export const termsOfPayment = [
  {
    id: 1,
    name: "Thanh toán trước"
  },
  {
    id: 2,
    name: "Thanh toán sau nhận hàng"
  },
  {
    id: 3,
    name: "Công nợ"
  }
]

export const contractRule = [
  {
    id: 1,
    name: "0 - 10.000.000 VNĐ"
  },
  {
    id: 2,
    name: "10.000.000 - 20.000.000 VNĐ"
  },
  {
    id: 3,
    name: "Trên 100.000.000 VNĐ"
  }
]

export const typeReceipt = [
  {
    id: 1,
    name: "Nhập từ phiếu mua"
  },
  {
    id: 2,
    name: "Nhập từ xuất kho smartgap"
  },
  {
    id: 4,
    name: "Nhập kiểm kho"
  }
]
