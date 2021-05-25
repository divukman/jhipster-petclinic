import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPetType, PetType } from '../pet-type.model';
import { PetTypeService } from '../service/pet-type.service';

@Component({
  selector: 'jhi-pet-type-update',
  templateUrl: './pet-type-update.component.html',
})
export class PetTypeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(80)]],
  });

  constructor(protected petTypeService: PetTypeService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ petType }) => {
      this.updateForm(petType);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const petType = this.createFromForm();
    if (petType.id !== undefined) {
      this.subscribeToSaveResponse(this.petTypeService.update(petType));
    } else {
      this.subscribeToSaveResponse(this.petTypeService.create(petType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPetType>>): void {
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

  protected updateForm(petType: IPetType): void {
    this.editForm.patchValue({
      id: petType.id,
      name: petType.name,
    });
  }

  protected createFromForm(): IPetType {
    return {
      ...new PetType(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
