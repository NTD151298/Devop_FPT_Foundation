import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/services/auth/auth.guard';
import { GroupComponent } from './group/group.component';

import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: 'userList',
          component: UserComponent,
        },
        {
          path: 'group',
          component: GroupComponent,
        },
        {
          path: 'role',
          component: RoleComponent,
        },
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
