import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVisit, Visit } from '../visit.model';
import { VisitService } from '../service/visit.service';
import { IPet } from 'app/entities/pet/pet.model';
import { PetService } from 'app/entities/pet/service/pet.service';

@Component({
  selector: 'jhi-visit-update',
  templateUrl: './visit-update.component.html',
})
export class VisitUpdateComponent implements OnInit {
  isSaving = false;

  petsSharedCollection: IPet[] = [];

  editForm = this.fb.group({
    id: [],
    visitDate: [],
    description: [null, [Validators.required, Validators.maxLength(255)]],
    pet: [],
  });

  constructor(
    protected visitService: VisitService,
    protected petService: PetService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ visit }) => {
      this.updateForm(visit);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const visit = this.createFromForm();
    if (visit.id !== undefined) {
      this.subscribeToSaveResponse(this.visitService.update(visit));
    } else {
      this.subscribeToSaveResponse(this.visitService.create(visit));
    }
  }

  trackPetById(index: number, item: IPet): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVisit>>): void {
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

  protected updateForm(visit: IVisit): void {
    this.editForm.patchValue({
      id: visit.id,
      visitDate: visit.visitDate,
      description: visit.description,
      pet: visit.pet,
    });

    this.petsSharedCollection = this.petService.addPetToCollectionIfMissing(this.petsSharedCollection, visit.pet);
  }

  protected loadRelationshipsOptions(): void {
    this.petService
      .query()
      .pipe(map((res: HttpResponse<IPet[]>) => res.body ?? []))
      .pipe(map((pets: IPet[]) => this.petService.addPetToCollectionIfMissing(pets, this.editForm.get('pet')!.value)))
      .subscribe((pets: IPet[]) => (this.petsSharedCollection = pets));
  }

  protected createFromForm(): IVisit {
    return {
      ...new Visit(),
      id: this.editForm.get(['id'])!.value,
      visitDate: this.editForm.get(['visitDate'])!.value,
      description: this.editForm.get(['description'])!.value,
      pet: this.editForm.get(['pet'])!.value,
    };
  }
}
