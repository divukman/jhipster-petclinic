jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OwnerService } from '../service/owner.service';
import { IOwner, Owner } from '../owner.model';

import { OwnerUpdateComponent } from './owner-update.component';

describe('Component Tests', () => {
  describe('Owner Management Update Component', () => {
    let comp: OwnerUpdateComponent;
    let fixture: ComponentFixture<OwnerUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let ownerService: OwnerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OwnerUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(OwnerUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OwnerUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      ownerService = TestBed.inject(OwnerService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const owner: IOwner = { id: 456 };

        activatedRoute.data = of({ owner });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(owner));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const owner = { id: 123 };
        spyOn(ownerService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ owner });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: owner }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(ownerService.update).toHaveBeenCalledWith(owner);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const owner = new Owner();
        spyOn(ownerService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ owner });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: owner }));
        saveSubject.complete();

        // THEN
        expect(ownerService.create).toHaveBeenCalledWith(owner);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const owner = { id: 123 };
        spyOn(ownerService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ owner });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(ownerService.update).toHaveBeenCalledWith(owner);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
