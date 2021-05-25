import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'pet-type',
        data: { pageTitle: 'jhpetclinicApp.petType.home.title' },
        loadChildren: () => import('./pet-type/pet-type.module').then(m => m.PetTypeModule),
      },
      {
        path: 'specialty',
        data: { pageTitle: 'jhpetclinicApp.specialty.home.title' },
        loadChildren: () => import('./specialty/specialty.module').then(m => m.SpecialtyModule),
      },
      {
        path: 'vet',
        data: { pageTitle: 'jhpetclinicApp.vet.home.title' },
        loadChildren: () => import('./vet/vet.module').then(m => m.VetModule),
      },
      {
        path: 'owner',
        data: { pageTitle: 'jhpetclinicApp.owner.home.title' },
        loadChildren: () => import('./owner/owner.module').then(m => m.OwnerModule),
      },
      {
        path: 'pet',
        data: { pageTitle: 'jhpetclinicApp.pet.home.title' },
        loadChildren: () => import('./pet/pet.module').then(m => m.PetModule),
      },
      {
        path: 'visit',
        data: { pageTitle: 'jhpetclinicApp.visit.home.title' },
        loadChildren: () => import('./visit/visit.module').then(m => m.VisitModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
