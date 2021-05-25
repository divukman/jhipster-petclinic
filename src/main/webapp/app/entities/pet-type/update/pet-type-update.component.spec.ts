jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PetTypeService } from '../service/pet-type.service';
import { IPetType, PetType } from '../pet-type.model';

import { PetTypeUpdateComponent } from './pet-type-update.component';

describe('Component Tests', () => {
  describe('PetType Management Update Component', () => {
    let comp: PetTypeUpdateComponent;
    let fixture: ComponentFixture<PetTypeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let petTypeService: PetTypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PetTypeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PetTypeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PetTypeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      petTypeService = TestBed.inject(PetTypeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const petType: IPetType = { id: 456 };

        activatedRoute.data = of({ petType });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(petType));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const petType = { id: 123 };
        spyOn(petTypeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ petType });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: petType }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(petTypeService.update).toHaveBeenCalledWith(petType);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const petType = new PetType();
        spyOn(petTypeService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ petType });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: petType }));
        saveSubject.complete();

        // THEN
        expect(petTypeService.create).toHaveBeenCalledWith(petType);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const petType = { id: 123 };
        spyOn(petTypeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ petType });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(petTypeService.update).toHaveBeenCalledWith(petType);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
