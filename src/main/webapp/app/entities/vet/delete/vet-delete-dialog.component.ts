import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVet } from '../vet.model';
import { VetService } from '../service/vet.service';

@Component({
  templateUrl: './vet-delete-dialog.component.html',
})
export class VetDeleteDialogComponent {
  vet?: IVet;

  constructor(protected vetService: VetService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.vetService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
