import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SpecialtyComponent } from '../list/specialty.component';
import { SpecialtyDetailComponent } from '../detail/specialty-detail.component';
import { SpecialtyUpdateComponent } from '../update/specialty-update.component';
import { SpecialtyRoutingResolveService } from './specialty-routing-resolve.service';

const specialtyRoute: Routes = [
  {
    path: '',
    component: SpecialtyComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SpecialtyDetailComponent,
    resolve: {
      specialty: SpecialtyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SpecialtyUpdateComponent,
    resolve: {
      specialty: SpecialtyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SpecialtyUpdateComponent,
    resolve: {
      specialty: SpecialtyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(specialtyRoute)],
  exports: [RouterModule],
})
export class SpecialtyRoutingModule {}
