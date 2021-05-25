jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SpecialtyService } from '../service/specialty.service';
import { ISpecialty, Specialty } from '../specialty.model';

import { SpecialtyUpdateComponent } from './specialty-update.component';

describe('Component Tests', () => {
  describe('Specialty Management Update Component', () => {
    let comp: SpecialtyUpdateComponent;
    let fixture: ComponentFixture<SpecialtyUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let specialtyService: SpecialtyService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SpecialtyUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SpecialtyUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SpecialtyUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      specialtyService = TestBed.inject(SpecialtyService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const specialty: ISpecialty = { id: 456 };

        activatedRoute.data = of({ specialty });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(specialty));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const specialty = { id: 123 };
        spyOn(specialtyService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ specialty });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: specialty }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(specialtyService.update).toHaveBeenCalledWith(specialty);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const specialty = new Specialty();
        spyOn(specialtyService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ specialty });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: specialty }));
        saveSubject.complete();

        // THEN
        expect(specialtyService.create).toHaveBeenCalledWith(specialty);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const specialty = { id: 123 };
        spyOn(specialtyService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ specialty });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(specialtyService.update).toHaveBeenCalledWith(specialty);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
