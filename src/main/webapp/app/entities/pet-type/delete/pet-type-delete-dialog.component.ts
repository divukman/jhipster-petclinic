import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPetType } from '../pet-type.model';
import { PetTypeService } from '../service/pet-type.service';

@Component({
  templateUrl: './pet-type-delete-dialog.component.html',
})
export class PetTypeDeleteDialogComponent {
  petType?: IPetType;

  constructor(protected petTypeService: PetTypeService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.petTypeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
