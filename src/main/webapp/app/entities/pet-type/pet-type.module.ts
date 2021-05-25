import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { PetTypeComponent } from './list/pet-type.component';
import { PetTypeDetailComponent } from './detail/pet-type-detail.component';
import { PetTypeUpdateComponent } from './update/pet-type-update.component';
import { PetTypeDeleteDialogComponent } from './delete/pet-type-delete-dialog.component';
import { PetTypeRoutingModule } from './route/pet-type-routing.module';

@NgModule({
  imports: [SharedModule, PetTypeRoutingModule],
  declarations: [PetTypeComponent, PetTypeDetailComponent, PetTypeUpdateComponent, PetTypeDeleteDialogComponent],
  entryComponents: [PetTypeDeleteDialogComponent],
})
export class PetTypeModule {}
