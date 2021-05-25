jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { VisitService } from '../service/visit.service';
import { IVisit, Visit } from '../visit.model';
import { IPet } from 'app/entities/pet/pet.model';
import { PetService } from 'app/entities/pet/service/pet.service';

import { VisitUpdateComponent } from './visit-update.component';

describe('Component Tests', () => {
  describe('Visit Management Update Component', () => {
    let comp: VisitUpdateComponent;
    let fixture: ComponentFixture<VisitUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let visitService: VisitService;
    let petService: PetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VisitUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(VisitUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VisitUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      visitService = TestBed.inject(VisitService);
      petService = TestBed.inject(PetService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Pet query and add missing value', () => {
        const visit: IVisit = { id: 456 };
        const pet: IPet = { id: 61988 };
        visit.pet = pet;

        const petCollection: IPet[] = [{ id: 65170 }];
        spyOn(petService, 'query').and.returnValue(of(new HttpResponse({ body: petCollection })));
        const additionalPets = [pet];
        const expectedCollection: IPet[] = [...additionalPets, ...petCollection];
        spyOn(petService, 'addPetToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ visit });
        comp.ngOnInit();

        expect(petService.query).toHaveBeenCalled();
        expect(petService.addPetToCollectionIfMissing).toHaveBeenCalledWith(petCollection, ...additionalPets);
        expect(comp.petsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const visit: IVisit = { id: 456 };
        const pet: IPet = { id: 55949 };
        visit.pet = pet;

        activatedRoute.data = of({ visit });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(visit));
        expect(comp.petsSharedCollection).toContain(pet);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const visit = { id: 123 };
        spyOn(visitService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ visit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: visit }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(visitService.update).toHaveBeenCalledWith(visit);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const visit = new Visit();
        spyOn(visitService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ visit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: visit }));
        saveSubject.complete();

        // THEN
        expect(visitService.create).toHaveBeenCalledWith(visit);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const visit = { id: 123 };
        spyOn(visitService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ visit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(visitService.update).toHaveBeenCalledWith(visit);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPetById', () => {
        it('Should return tracked Pet primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPetById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
