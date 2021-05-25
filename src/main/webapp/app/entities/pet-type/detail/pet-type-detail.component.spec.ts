import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PetTypeDetailComponent } from './pet-type-detail.component';

describe('Component Tests', () => {
  describe('PetType Management Detail Component', () => {
    let comp: PetTypeDetailComponent;
    let fixture: ComponentFixture<PetTypeDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PetTypeDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ petType: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PetTypeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PetTypeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load petType on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.petType).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
