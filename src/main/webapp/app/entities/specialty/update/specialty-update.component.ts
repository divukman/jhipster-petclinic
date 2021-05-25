import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISpecialty, Specialty } from '../specialty.model';
import { SpecialtyService } from '../service/specialty.service';

@Component({
  selector: 'jhi-specialty-update',
  templateUrl: './specialty-update.component.html',
})
export class SpecialtyUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(80)]],
  });

  constructor(protected specialtyService: SpecialtyService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ specialty }) => {
      this.updateForm(specialty);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const specialty = this.createFromForm();
    if (specialty.id !== undefined) {
      this.subscribeToSaveResponse(this.specialtyService.update(specialty));
    } else {
      this.subscribeToSaveResponse(this.specialtyService.create(specialty));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISpecialty>>): void {
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

  protected updateForm(specialty: ISpecialty): void {
    this.editForm.patchValue({
      id: specialty.id,
      name: specialty.name,
    });
  }

  protected createFromForm(): ISpecialty {
    return {
      ...new Specialty(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
