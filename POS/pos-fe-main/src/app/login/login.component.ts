import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/services/auth/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  account: any = {
    UserName: '',
    Password: ''
  };
  seePass: boolean = false;
  constructor(
    private _auth: AuthenticationService,
    private router: Router,
    public _toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }
  login() {
    if (!this.account.UserName || !this.account.Password) {
      this._toastr.warning('Nhập tên đăng nhập và mật khẩu!');
      return;
    }
    this._auth.login(this.account).subscribe((res) => {
      if (res) {
        this._toastr.success('Đăng nhập thành công!');
        this.router.navigate(['/main/dashboard']);
      } else {
        this._toastr.error('Đăng nhập thất bại!')
      }
    })
  }
  revealPass() {
    this.seePass = !this.seePass;
  }

}
