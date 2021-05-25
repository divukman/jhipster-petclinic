import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IOwner, Owner } from '../owner.model';
import { OwnerService } from '../service/owner.service';

@Component({
  selector: 'jhi-owner-update',
  templateUrl: './owner-update.component.html',
})
export class OwnerUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    firstName: [null, [Validators.required, Validators.maxLength(30)]],
    lastName: [null, [Validators.required, Validators.maxLength(30)]],
    address: [null, [Validators.required, Validators.maxLength(255)]],
    city: [null, [Validators.required, Validators.maxLength(80)]],
    telephone: [null, [Validators.required, Validators.maxLength(20)]],
  });

  constructor(protected ownerService: OwnerService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ owner }) => {
      this.updateForm(owner);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const owner = this.createFromForm();
    if (owner.id !== undefined) {
      this.subscribeToSaveResponse(this.ownerService.update(owner));
    } else {
      this.subscribeToSaveResponse(this.ownerService.create(owner));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOwner>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(owner: IOwner): void {
    this.editForm.patchValue({
      id: owner.id,
      firstName: owner.firstName,
      lastName: owner.lastName,
      address: owner.address,
      city: owner.city,
      telephone: owner.telephone,
    });
  }

  protected createFromForm(): IOwner {
    return {
      ...new Owner(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      address: this.editForm.get(['address'])!.value,
      city: this.editForm.get(['city'])!.value,
      telephone: this.editForm.get(['telephone'])!.value,
    };
  }
}
