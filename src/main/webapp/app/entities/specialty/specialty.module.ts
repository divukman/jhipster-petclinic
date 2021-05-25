import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { SpecialtyComponent } from './list/specialty.component';
import { SpecialtyDetailComponent } from './detail/specialty-detail.component';
import { SpecialtyUpdateComponent } from './update/specialty-update.component';
import { SpecialtyDeleteDialogComponent } from './delete/specialty-delete-dialog.component';
import { SpecialtyRoutingModule } from './route/specialty-routing.module';

@NgModule({
  imports: [SharedModule, SpecialtyRoutingModule],
  declarations: [SpecialtyComponent, SpecialtyDetailComponent, SpecialtyUpdateComponent, SpecialtyDeleteDialogComponent],
  entryComponents: [SpecialtyDeleteDialogComponent],
})
export class SpecialtyModule {}
