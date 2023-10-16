export const menu = [
  {
    label: 'Trang Chủ',
    title: 'Trang Chủ',
    code: 'QUANLYTRANGCHU',
    routerLink: '/main/dashboard',
    haveChild: false,
    icon: "fa-solid fa-house",
    items: []
  },
  {
    label: 'Quản lý sản phẩm',
    title: 'Quản lý sản phẩm',
    code: 'QUANLYSANPHAM',
    haveChild: true,
    icon: "fa-brands fa-product-hunt",
    items: [
      {
        label: 'Quản lý sản phẩm',
        code: 'QUANLYSANPHAM',
        routerLink: '/main/products/product',
      },
      {
        label: 'Quản lý sản phẩm theo kho',
        code: 'QUANLYSANPHAM',
        routerLink: '/main/products/product-detail-warehouse',
      },
      {
        label: 'Lịch sử thay đổi giá',
        code: 'LICHSUTHAYDOIGIA',
        routerLink: '/main/products/history-change-price',
      },
      {
        label: 'In barcode sản phẩm',
        code: 'INBARCODESANPHAM',
        routerLink: '/main/products/product-print-barcode',
      },
      {
        label: 'Quản lý sản phẩm combo',
        code: 'QUANLYSANPHAMCOMBO',
        routerLink: '/main/products/product-combo',
      },
    ]
  },
  {
    label: 'Quản lý đơn hàng',
    title: 'Quản lý đơn hàng',
    code: 'QUANLYDONHANG',
    routerLink: '/main/orders/list',
    haveChild: false,
    icon: "fa-solid fa-cart-shopping",
    items: []
  },
  {
    label: 'Xem sản phẩm theo kho',
    title: 'Xem sản phẩm theo kho',
    code: 'QUANLYSANPHAM',
    routerLink: '/main/products/product-warehouse',
    haveChild: false,
    icon: "fa-brands fa-product-hunt",
    items: []
  },
  {
    label: 'Quản lý hoàn hàng',
    title: 'Quản lý hoàn hàng',
    code: 'QUANLYHOANHANG',
    routerLink: '/main/refund',
    haveChild: false,
    icon: "fa fa-undo",
    items: []
  },
  {
    label: 'Yêu cầu nhập hàng',
    title: 'Yêu cầu nhập hàng',
    code: 'QUANLYYEUCAUKHO',
    routerLink: '/main/warehouses/warehouse-request/',
    haveChild: false,
    icon: "fa-solid fa-code-pull-request",
    items: []
  },
  {
    label: 'Phiếu mua hàng',
    title: 'Phiếu mua hàng',
    code: 'QUANLYPHIEUMUAHANG',
    routerLink: '/main/purchase',
    haveChild: false,
    icon: "fa-solid fa-money-check-dollar",
    items: []
  },
  {
    label: 'Phiếu kho',
    title: 'Phiếu kho',
    code: 'QUANLYKHO',
    haveChild: true,
    icon: "fa-solid fa-boxes-stacked",
    items: [
      {
        label: 'Danh sách kho',
        routerLink: '/main/warehouses/warehouse',
        code: 'QUANLYKHO',
      },
      {
        label: 'Nhập kho',
        code: 'QUANLYNHAPKHO',
        routerLink: '/main/warehouses/warehouse-receipt',
      },
      {
        label: 'Xuất kho',
        code: 'QUANLYXUATKHO',
        routerLink: '/main/warehouses/warehouse-export',
      },
      {
        label: 'Kiểm kho',
        code: 'QUANLYTONKHO',
        routerLink: '/main/warehouses/warehouse-inventory',
      },
    ]
  },
  {
    label: 'Quản lý khách hàng',
    title: 'Quản lý khách hàng',
    code: 'QUANLYKHACHHANG',
    routerLink: '/main/customers/list',
    haveChild: false,
    icon: "fa-solid fa-user-group",
    items: []
  },
  {
    label: 'Nhà cung cấp',
    title: 'Nhà cung cấp',
    code: 'QUANLYDOITAC',
    routerLink: '/main/partners/list',
    haveChild: false,
    icon: "fa-solid fa-handshake",
    items: []
  },
  {
    label: 'Quản lý phiếu giảm giá',
    title: 'Quản lý phiếu giảm giá',
    code: 'QUANLYBAOCAO',
    routerLink: '/main/promotion/promotion-list',
    haveChild: false,
    icon: "fa-solid fa-handshake",
    items: []
  },
  {
    label: 'Danh mục',
    title: 'Danh mục',
    code: 'QUANLYDANHMUC',
    haveChild: true,
    icon: "fa-solid fa-bars",
    items: [
      {
        label: 'Quản lý chuyên mục sản phẩm',
        code: 'QUANLYDANHMUC',
        routerLink: '/main/category-product',
      },
      {
        label: 'Quản lý gian hàng',
        code: 'QUANLYDANHMUC',
        routerLink: '/main/category-stalls',
      },
      {
        label: 'Quản lý nhóm',
        code: 'QUANLYDANHMUC',
        routerLink: '/main/category-group',
      },
      {
        label: 'Quản lý quy cách đóng gói',
        code: 'QUANLYDANHMUC',
        routerLink: '/main/category-packing',
      },
      {
        label: 'Quản lý đơn vị',
        code: 'QUANLYDANHMUC',
        routerLink: '/main/category-units',
      },
    ]
  },
  {
    label: 'Quản lý người dùng',
    title: 'Quản lý người dùng',
    code: 'QUANLYNGUOIDUNG',
    haveChild: true,
    icon: "fa-solid fa-user",
    items: [
      {
        label: 'Quản lý người dùng',
        code: 'QUANLYNGUOIDUNG',
        routerLink: '/main/user/userList',
      },
      {
        label: 'Quản lý nhóm',
        code: 'QUANLYNGUOIDUNG',
        routerLink: '/main/user/group',
      },
      {
        label: 'Quản lý phân quyền',
        code: 'QUANLYNGUOIDUNG',
        routerLink: '/main/user/role',
      },
    ]
  },
  {
    label: 'Quản lý voucher',
    title: 'Quản lý voucher',
    code: 'QUANLYPHIEUGIAMGIA',
    routerLink: '/main/voucher',
    haveChild: false,
    icon: "fa-solid fa-circle-arrow-down",
    items: []
  },
  {
    label: 'Bắt đầu ca làm',
    title: 'Bắt đầu ca làm',
    code: 'QUANLYPHIENBANHANG',
    routerLink: '/main/sheft',
    haveChild: false,
    icon: "fa-solid fa-circle-play",
    items: []
  },
  {
    label: 'Danh sách bán hàng',
    title: 'Danh sách bán hàng',
    code: 'QUANLYPHIENBANHANG',
    routerLink: '/main/sale-session',
    haveChild: false,
    icon: "fa-solid fa-clipboard-list",
    items: []
  },
  {
    label: 'Báo cáo',
    title: 'Báo cáo',
    code: 'QUANLYBAOCAO',
    haveChild: true,
    icon: "fa fa-line-chart ",
    items: [
      {
        label: 'Doanh thu sản phẩm',
        code: 'QUANLYBAOCAO',
        routerLink: '/main/report/product-revenue',
      },
      {
        label: 'Báo cáo lợi nhuận',
        code: 'QUANLYBAOCAO',
        routerLink: '/main/report/profit',
      },
      {
        label: 'Xuất nhập tồn kho',
        code: 'QUANLYBAOCAO',
        routerLink: '/main/report/in-out-inventory-warehouse',
      },
      {
        label: 'Xuất nhập tồn',
        code: 'QUANLYBAOCAO',
        routerLink: '/main/report/in-out-inventory',
      },
      {
        label: 'Xuất nhập ngày',
        code: 'QUANLYBAOCAO',
        routerLink: '/main/report/in-out-daily',
      },
      {
        label: 'Sổ quỹ doanh thu',
        code: 'QUANLYBAOCAO',
        routerLink: '/main/report/revenue-book',
      },
      {
        label: 'Sổ quỹ doanh thu theo ca',
        code: 'QUANLYBAOCAO',
        routerLink: '/main/report/shift-revenue-book',
      },
    ]
  },
  {
    label: 'Hợp đồng',
    title: 'Hợp đồng',
    code: 'QUANLYHOPDONG',
    routerLink: '/main/contract',
    haveChild: false,
    icon: "fa-solid fa-file-signature",
    items: []
  },
  {
    label: 'Chuyển tiền',
    title: 'Chuyển tiền',
    code: 'QUANLYPHIENCHUYENTIEN',
    routerLink: '/main/money-transfer-session',
    haveChild: false,
    icon: "fa-solid fa-file-signature",
    items: []
  },
  {
    label: 'Đối soát công nợ',
    title: 'Đối soát công nợ',
    code: 'QUANLYDOISOAT',
    haveChild: true,
    icon: "fa fa-line-chart",
    items: [
      {
        label: 'Đối soát phiếu nhập',
        code: 'QUANLYDOISOAT',
        routerLink: '/main/control/receipt',
      },
      {
        label: 'Thanh toán',
        code: 'QUANLYDOISOAT',
        routerLink: '/main/control/payment',
      },
      {
        label: 'Công nợ',
        code: 'QUANLYDOISOAT',
        routerLink: '/main/control/debt',
      },
    ]
  },


]
