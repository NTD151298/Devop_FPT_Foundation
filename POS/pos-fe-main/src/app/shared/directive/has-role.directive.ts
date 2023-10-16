import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthenticationService } from 'src/services/auth/auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private auth: AuthenticationService
  ) { }

  @Input() set appHasRole(permission: any) {
    var isAuthorize = false;
    var listPermission = this.auth.currentUserInfoValue.roles
    if (listPermission != null && listPermission.length > 0) {
      listPermission.forEach(obj => {
        obj.role_detail.forEach(ele => {
          permission.forEach(permissionElement => {
            if (!isAuthorize && ele == permissionElement) {
              isAuthorize = true;
            }
          })
        })
      })
    }
    if (isAuthorize) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }


  ngOnInit() {

  }

}
