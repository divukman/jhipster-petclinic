import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVet, Vet } from '../vet.model';
import { VetService } from '../service/vet.service';
import { ISpecialty } from 'app/entities/specialty/specialty.model';
import { SpecialtyService } from 'app/entities/specialty/service/specialty.service';

@Component({
  selector: 'jhi-vet-update',
  templateUrl: './vet-update.component.html',
})
export class VetUpdateComponent implements OnInit {
  isSaving = false;

  specialtiesSharedCollection: ISpecialty[] = [];

  editForm = this.fb.group({
    id: [],
    firstName: [null, [Validators.required, Validators.maxLength(30)]],
    lastName: [null, [Validators.required, Validators.maxLength(30)]],
    specialties: [],
  });

  constructor(
    protected vetService: VetService,
    protected specialtyService: SpecialtyService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vet }) => {
      this.updateForm(vet);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vet = this.createFromForm();
    if (vet.id !== undefined) {
      this.subscribeToSaveResponse(this.vetService.update(vet));
    } else {
      this.subscribeToSaveResponse(this.vetService.create(vet));
    }
  }

  trackSpecialtyById(index: number, item: ISpecialty): number {
    return item.id!;
  }

  getSelectedSpecialty(option: ISpecialty, selectedVals?: ISpecialty[]): ISpecialty {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVet>>): void {
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

  protected updateForm(vet: IVet): void {
    this.editForm.patchValue({
      id: vet.id,
      firstName: vet.firstName,
      lastName: vet.lastName,
      specialties: vet.specialties,
    });

    this.specialtiesSharedCollection = this.specialtyService.addSpecialtyToCollectionIfMissing(
      this.specialtiesSharedCollection,
      ...(vet.specialties ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.specialtyService
      .query()
      .pipe(map((res: HttpResponse<ISpecialty[]>) => res.body ?? []))
      .pipe(
        map((specialties: ISpecialty[]) =>
          this.specialtyService.addSpecialtyToCollectionIfMissing(specialties, ...(this.editForm.get('specialties')!.value ?? []))
        )
      )
      .subscribe((specialties: ISpecialty[]) => (this.specialtiesSharedCollection = specialties));
  }

  protected createFromForm(): IVet {
    return {
      ...new Vet(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      specialties: this.editForm.get(['specialties'])!.value,
    };
  }
}
