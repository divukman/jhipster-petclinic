import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPet, Pet } from '../pet.model';
import { PetService } from '../service/pet.service';
import { IPetType } from 'app/entities/pet-type/pet-type.model';
import { PetTypeService } from 'app/entities/pet-type/service/pet-type.service';
import { IOwner } from 'app/entities/owner/owner.model';
import { OwnerService } from 'app/entities/owner/service/owner.service';

@Component({
  selector: 'jhi-pet-update',
  templateUrl: './pet-update.component.html',
})
export class PetUpdateComponent implements OnInit {
  isSaving = false;

  petTypesSharedCollection: IPetType[] = [];
  ownersSharedCollection: IOwner[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(30)]],
    birthDate: [],
    type: [],
    owner: [],
  });

  constructor(
    protected petService: PetService,
    protected petTypeService: PetTypeService,
    protected ownerService: OwnerService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pet }) => {
      this.updateForm(pet);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pet = this.createFromForm();
    if (pet.id !== undefined) {
      this.subscribeToSaveResponse(this.petService.update(pet));
    } else {
      this.subscribeToSaveResponse(this.petService.create(pet));
    }
  }

  trackPetTypeById(index: number, item: IPetType): number {
    return item.id!;
  }

  trackOwnerById(index: number, item: IOwner): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPet>>): void {
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

  protected updateForm(pet: IPet): void {
    this.editForm.patchValue({
      id: pet.id,
      name: pet.name,
      birthDate: pet.birthDate,
      type: pet.type,
      owner: pet.owner,
    });

    this.petTypesSharedCollection = this.petTypeService.addPetTypeToCollectionIfMissing(this.petTypesSharedCollection, pet.type);
    this.ownersSharedCollection = this.ownerService.addOwnerToCollectionIfMissing(this.ownersSharedCollection, pet.owner);
  }

  protected loadRelationshipsOptions(): void {
    this.petTypeService
      .query()
      .pipe(map((res: HttpResponse<IPetType[]>) => res.body ?? []))
      .pipe(map((petTypes: IPetType[]) => this.petTypeService.addPetTypeToCollectionIfMissing(petTypes, this.editForm.get('type')!.value)))
      .subscribe((petTypes: IPetType[]) => (this.petTypesSharedCollection = petTypes));

    this.ownerService
      .query()
      .pipe(map((res: HttpResponse<IOwner[]>) => res.body ?? []))
      .pipe(map((owners: IOwner[]) => this.ownerService.addOwnerToCollectionIfMissing(owners, this.editForm.get('owner')!.value)))
      .subscribe((owners: IOwner[]) => (this.ownersSharedCollection = owners));
  }

  protected createFromForm(): IPet {
    return {
      ...new Pet(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      birthDate: this.editForm.get(['birthDate'])!.value,
      type: this.editForm.get(['type'])!.value,
      owner: this.editForm.get(['owner'])!.value,
    };
  }
}
