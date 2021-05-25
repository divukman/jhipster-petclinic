jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PetService } from '../service/pet.service';
import { IPet, Pet } from '../pet.model';
import { IPetType } from 'app/entities/pet-type/pet-type.model';
import { PetTypeService } from 'app/entities/pet-type/service/pet-type.service';
import { IOwner } from 'app/entities/owner/owner.model';
import { OwnerService } from 'app/entities/owner/service/owner.service';

import { PetUpdateComponent } from './pet-update.component';

describe('Component Tests', () => {
  describe('Pet Management Update Component', () => {
    let comp: PetUpdateComponent;
    let fixture: ComponentFixture<PetUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let petService: PetService;
    let petTypeService: PetTypeService;
    let ownerService: OwnerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PetUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PetUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PetUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      petService = TestBed.inject(PetService);
      petTypeService = TestBed.inject(PetTypeService);
      ownerService = TestBed.inject(OwnerService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call PetType query and add missing value', () => {
        const pet: IPet = { id: 456 };
        const type: IPetType = { id: 37018 };
        pet.type = type;

        const petTypeCollection: IPetType[] = [{ id: 34920 }];
        spyOn(petTypeService, 'query').and.returnValue(of(new HttpResponse({ body: petTypeCollection })));
        const additionalPetTypes = [type];
        const expectedCollection: IPetType[] = [...additionalPetTypes, ...petTypeCollection];
        spyOn(petTypeService, 'addPetTypeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ pet });
        comp.ngOnInit();

        expect(petTypeService.query).toHaveBeenCalled();
        expect(petTypeService.addPetTypeToCollectionIfMissing).toHaveBeenCalledWith(petTypeCollection, ...additionalPetTypes);
        expect(comp.petTypesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Owner query and add missing value', () => {
        const pet: IPet = { id: 456 };
        const owner: IOwner = { id: 81661 };
        pet.owner = owner;

        const ownerCollection: IOwner[] = [{ id: 63207 }];
        spyOn(ownerService, 'query').and.returnValue(of(new HttpResponse({ body: ownerCollection })));
        const additionalOwners = [owner];
        const expectedCollection: IOwner[] = [...additionalOwners, ...ownerCollection];
        spyOn(ownerService, 'addOwnerToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ pet });
        comp.ngOnInit();

        expect(ownerService.query).toHaveBeenCalled();
        expect(ownerService.addOwnerToCollectionIfMissing).toHaveBeenCalledWith(ownerCollection, ...additionalOwners);
        expect(comp.ownersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const pet: IPet = { id: 456 };
        const type: IPetType = { id: 46153 };
        pet.type = type;
        const owner: IOwner = { id: 24601 };
        pet.owner = owner;

        activatedRoute.data = of({ pet });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(pet));
        expect(comp.petTypesSharedCollection).toContain(type);
        expect(comp.ownersSharedCollection).toContain(owner);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pet = { id: 123 };
        spyOn(petService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pet });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pet }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(petService.update).toHaveBeenCalledWith(pet);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pet = new Pet();
        spyOn(petService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pet });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pet }));
        saveSubject.complete();

        // THEN
        expect(petService.create).toHaveBeenCalledWith(pet);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pet = { id: 123 };
        spyOn(petService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pet });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(petService.update).toHaveBeenCalledWith(pet);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPetTypeById', () => {
        it('Should return tracked PetType primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPetTypeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackOwnerById', () => {
        it('Should return tracked Owner primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackOwnerById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
