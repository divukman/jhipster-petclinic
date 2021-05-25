import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SpecialtyDetailComponent } from './specialty-detail.component';

describe('Component Tests', () => {
  describe('Specialty Management Detail Component', () => {
    let comp: SpecialtyDetailComponent;
    let fixture: ComponentFixture<SpecialtyDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SpecialtyDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ specialty: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(SpecialtyDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SpecialtyDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load specialty on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.specialty).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
