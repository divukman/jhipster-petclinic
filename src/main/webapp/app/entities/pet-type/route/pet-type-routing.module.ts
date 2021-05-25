import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PetTypeComponent } from '../list/pet-type.component';
import { PetTypeDetailComponent } from '../detail/pet-type-detail.component';
import { PetTypeUpdateComponent } from '../update/pet-type-update.component';
import { PetTypeRoutingResolveService } from './pet-type-routing-resolve.service';

const petTypeRoute: Routes = [
  {
    path: '',
    component: PetTypeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PetTypeDetailComponent,
    resolve: {
      petType: PetTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PetTypeUpdateComponent,
    resolve: {
      petType: PetTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PetTypeUpdateComponent,
    resolve: {
      petType: PetTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(petTypeRoute)],
  exports: [RouterModule],
})
export class PetTypeRoutingModule {}
