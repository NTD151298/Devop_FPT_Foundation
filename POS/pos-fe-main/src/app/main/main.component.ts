import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrimeNGConfig } from 'primeng/api';
import { MenuItem } from 'primeng/api/menuitem';
import { debounceTime, fromEvent, Observable, of } from 'rxjs';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { deepCopy } from '../shared/globlafunction';
import { ShareStateService } from '../shared/services/share-state.service';
import { vn } from './../../services/common/conts';
import { menu } from './listSidebar';
import { SaleSessionStartModalComponent } from './sales/sale-session-start-modal/sale-session-start-modal.component';
import { ForgotPasswordComponent } from './user/user/forgot-password/forgot-password.component';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterContentChecked {

  //menu: MenuItem[] = [];
  username;
  showSidebar = true;
  dropdown_menu = '';
  loading = false;
  constructor(
    private config: PrimeNGConfig,
    public _auth: AuthenticationService,
    private router: Router,
    private modalService: NgbModal,
    private changeDetector: ChangeDetectorRef,
    private shareStateService: ShareStateService,
    private cdr: ChangeDetectorRef,
  ) {
    // this.dropdown_menu = this.router.url.slice(6, this.router.url.length)
    this.shareStateService.stateLogoutOption$.subscribe(data => {
      this.activeLogout = data;
    })
    this.shareStateService.stateSideBarOption$.subscribe(data => {
      this.showSidebar = data;
    })
    this._auth.userInfo.subscribe(data => {
      if (data) {
        if (typeof data == 'string') {
          this.username = JSON.parse(data).full_name;
        } else {
          this.username = data.full_name;
        }
      }
    })

    window.addEventListener('storage', (event) => {
      if (event.storageArea != localStorage) return;
      if (event.key === 'full_name') {
        if (localStorage.getItem('full_name')) {
          this.username = localStorage.getItem('full_name');
          window.location.reload();
          this.router.navigate(['/main/dashboard']);
        } else {
          this.router.navigate(['/login']);
        }
      }
    });
  }
  menu: any[] = [];
  menuAuthen: any[] = [];

  ngOnInit(): void {
    this.config.setTranslation(vn)
    let menuChildrenRoot = deepCopy(menu);
    let menuParenRoot = deepCopy(menu);
    this._auth.currentToken.subscribe(token => {
      if (token) {
        let roles = this._auth.currentUserInfoValue['roles'];
        roles = roles ? roles : [];
        let listMenuParen: any = [];
        let listMenuchildren: any = [];
        // lấy menu con
        menuChildrenRoot.forEach((obj, index) => {
          obj.items.map(objChildren => {
            objChildren.idParen = index + 1
          })
          listMenuchildren.push(...obj.items);
        });
        // lấy menu cha
        listMenuParen = menuParenRoot.map((obj, index) => {
          obj.id = index + 1;
          obj.items = [];
          return obj
        });   
        // check phân quyền vs api roles
        roles.forEach(obj => {
          let isParen = listMenuParen.some(ele => ele.code == obj.role);
          let isChildren = listMenuchildren.some(ele => ele.code == obj.role);
          if (isParen) {
            let itemParen: any = listMenuParen.filter(ele => ele.code == obj.role);
            this.menuAuthen.push(...itemParen);
          }
          if (isChildren) {
            this.menuAuthen.map(ele => {
              if (ele.code == obj.role) {
                let itemChildren: any = listMenuchildren.filter(objChildren => objChildren.idParen == ele.id);
                ele.items.push(...itemChildren);
              }
            })
          }
        });
        this.menuAuthen.sort((a, b) => a.id > b.id ? 1 : -1);
        this.loading = true;
      } else {
        this.router.navigate(['/login'])
      }

      // cũ
      // this._auth.currentToken.subscribe(token => {
      //   if (token) {
      //     let roles = this._auth.currentUserInfoValue['roles'];
      //     console.log(roles);
      //     roles = roles ? roles : [];
      //     for (let i = 0; i < this.menu.length; i++) {
      //       if (this.menu[i].items.length > 0) {
      //         for (let j = 0; j < this.menu[i].items.length; j++) {
      //           for (let h = 0; h < roles.length; h++) {
      //             if (this.menu[i].items[j].code == roles[h].role) {
      //               if (this.menuAuthen.length > 0) {
      //                 if (this.menuAuthen[this.menuAuthen.length - 1]['code'] == this.menu[i].code) {
      //                   this.menuAuthen[this.menuAuthen.length - 1]['items'].push(this.menu[i].items[j])
      //                 } else {
      //                   this.menuAuthen.push({ ...this.menu[i], items: [this.menu[i].items[j]] });
      //                 }
      //               } else {
      //                 this.menuAuthen.push({ ...this.menu[i], items: [this.menu[i].items[j]] });
      //               }
      //             }
      //           }
      //         }
      //       } else {
      //         for (let h = 0; h < roles.length; h++) {
      //           if (roles[h].role.includes(this.menu[i].code)) {
      //             this.menuAuthen.push(this.menu[i]);
      //             break;
      //           }
      //         }
      //       }
      //     }
      //     console.log(this.menuAuthen);
      //     this.loading = true;
      //   } else {
      //     this.router.navigate(['/login'])
      //   }
    })
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  activeLogout = true;
  showLogout(event) {
    event.stopPropagation();
    this.activeLogout = !this.activeLogout;
  }

  logOut() {
    this._auth.logout();
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  showList() {

  }

  showMenuDropDown(data) {
    if (this.dropdown_menu) {
      if (this.dropdown_menu == data) {
        this.dropdown_menu = '';
      } else {
        this.dropdown_menu = data;
      }
    } else {
      this.dropdown_menu = data;
    }
  }

  forgotPassword() {
    let item = JSON.parse(localStorage.getItem('userInfo'));
    const dialogRef = this.modalService.open(ForgotPasswordComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.itemDetail = item || null;
    dialogRef.componentInstance.itemSubmited.subscribe((res?: any) => { });
  }

  saleSessionStart() {
    const dialogRef = this.modalService.open(SaleSessionStartModalComponent,
      {
        size: 'md',
      });
    dialogRef.result.then(res => { }).catch(er => { console.log(er); })
  }
}
