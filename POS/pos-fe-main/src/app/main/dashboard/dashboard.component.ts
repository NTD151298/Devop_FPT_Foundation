import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UIChart } from 'primeng/chart/chart';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild("chartbar") chartbar: UIChart; 
  @ViewChild("chartpie") chartpie: UIChart; 
 
  constructor(
    public _services: POSServices,
    public _toastr: ToastrService,
    private _auth: AuthenticationService
  ) {}
  typeRevenue: number = 2;
  typeTopProduct: number = 1;
  productData: any;
  chartBarOptions: any = {
    responsive: false,
    maintainAspectRatio: false,
  };
  chartPieOptions: any = {
    responsive: false,
    maintainAspectRatio: false,
  };
  revenueData: any;
  infoData: any = {
    total_order: 0,
    total_revenue: 0,
    total_customer: 0,
    total_partner: 0,
  };
  ngOnInit(): void {
    this.setDefaut();
    this.getInfo();
    this.getRevenue();
    this.getTopProduct();
  }

  setDefaut() {
    this.infoData = {
      total_order: 0,
      total_revenue: 0,
      total_customer: 0,
      total_partner: 0,
    };
    this.productData = {
      labels: ['-', '-', '-', '-', '-'],
      datasets: [
        {
          data: [0, 0, 0, 0, 0],
          backgroundColor: [
            '#42A5F5',
            '#66BB6A',
            '#FFA726',
            '#e04848',
            '#74a815',
          ],
          hoverBackgroundColor: [
            '#64B5F6',
            '#81C784',
            '#FFB74D',
            '#ed9292',
            '#73b11a',
          ],
        },
      ],
    };

    this.revenueData = {
      labels: ['Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8'],
      datasets: [
        {
          label: 'Doanh thu',
          backgroundColor: '#42A5F5',
          data: [0, 0, 0, 0, 0],
        },
      ],
    };
     
  }

  getInfo() {
    let data = this._auth.currentUserWarehouseId;
    this._services
      .Dasboard()
      .getInfo(data)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.infoData = res.data;
        } else {
          this._toastr.error(res.message);
        }
      });
  }

  getRevenue() {
    let data = { type: this.typeRevenue, warehouse_id: this._auth.currentUserWarehouseId };
    this._services
      .Dasboard()
      .getRevenue(data)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          if (res.data && res.data.data) {
            this.revenueData.labels = res.data.data.map((e) => e.name);
            this.revenueData.datasets[0].data = res.data.data.map((e) => e.total);
            this.chartbar.reinit(); 
          }
        } else {
          this._toastr.error(res.message);
        }
      });
  }

  getTopProduct() {
    let data = { type: this.typeTopProduct, warehouse_id: this._auth.currentUserWarehouseId };
    this._services
      .Dasboard()
      .getTopProduct(data)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          if (res.data) {
            this.productData.labels = res.data.map((e) => e.name);
            this.productData.datasets[0].data = res.data.map((e) => e.total);
            this.chartpie.reinit(); 
          }
        } else {
          this._toastr.error(res.message);
        }
      });
  }

  onChangeRevenue(){
    this.getRevenue(); 
  }
  onChangeTop(){
    this.getTopProduct(); 
  }
}
