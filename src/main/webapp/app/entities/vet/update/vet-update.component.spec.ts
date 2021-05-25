jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { VetService } from '../service/vet.service';
import { IVet, Vet } from '../vet.model';
import { ISpecialty } from 'app/entities/specialty/specialty.model';
import { SpecialtyService } from 'app/entities/specialty/service/specialty.service';

import { VetUpdateComponent } from './vet-update.component';

describe('Component Tests', () => {
  describe('Vet Management Update Component', () => {
    let comp: VetUpdateComponent;
    let fixture: ComponentFixture<VetUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let vetService: VetService;
    let specialtyService: SpecialtyService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VetUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(VetUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VetUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      vetService = TestBed.inject(VetService);
      specialtyService = TestBed.inject(SpecialtyService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Specialty query and add missing value', () => {
        const vet: IVet = { id: 456 };
        const specialties: ISpecialty[] = [{ id: 12839 }];
        vet.specialties = specialties;

        const specialtyCollection: ISpecialty[] = [{ id: 91481 }];
        spyOn(specialtyService, 'query').and.returnValue(of(new HttpResponse({ body: specialtyCollection })));
        const additionalSpecialties = [...specialties];
        const expectedCollection: ISpecialty[] = [...additionalSpecialties, ...specialtyCollection];
        spyOn(specialtyService, 'addSpecialtyToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ vet });
        comp.ngOnInit();

        expect(specialtyService.query).toHaveBeenCalled();
        expect(specialtyService.addSpecialtyToCollectionIfMissing).toHaveBeenCalledWith(specialtyCollection, ...additionalSpecialties);
        expect(comp.specialtiesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const vet: IVet = { id: 456 };
        const specialties: ISpecialty = { id: 61308 };
        vet.specialties = [specialties];

        activatedRoute.data = of({ vet });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(vet));
        expect(comp.specialtiesSharedCollection).toContain(specialties);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const vet = { id: 123 };
        spyOn(vetService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ vet });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: vet }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(vetService.update).toHaveBeenCalledWith(vet);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const vet = new Vet();
        spyOn(vetService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ vet });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: vet }));
        saveSubject.complete();

        // THEN
        expect(vetService.create).toHaveBeenCalledWith(vet);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const vet = { id: 123 };
        spyOn(vetService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ vet });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(vetService.update).toHaveBeenCalledWith(vet);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackSpecialtyById', () => {
        it('Should return tracked Specialty primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackSpecialtyById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedSpecialty', () => {
        it('Should return option if no Specialty is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedSpecialty(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Specialty for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedSpecialty(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Specialty is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedSpecialty(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
