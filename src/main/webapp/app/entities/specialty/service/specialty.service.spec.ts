import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISpecialty, Specialty } from '../specialty.model';

import { SpecialtyService } from './specialty.service';

describe('Service Tests', () => {
  describe('Specialty Service', () => {
    let service: SpecialtyService;
    let httpMock: HttpTestingController;
    let elemDefault: ISpecialty;
    let expectedResult: ISpecialty | ISpecialty[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SpecialtyService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Specialty', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Specialty()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Specialty', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Specialty', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
          },
          new Specialty()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Specialty', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Specialty', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSpecialtyToCollectionIfMissing', () => {
        it('should add a Specialty to an empty array', () => {
          const specialty: ISpecialty = { id: 123 };
          expectedResult = service.addSpecialtyToCollectionIfMissing([], specialty);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(specialty);
        });

        it('should not add a Specialty to an array that contains it', () => {
          const specialty: ISpecialty = { id: 123 };
          const specialtyCollection: ISpecialty[] = [
            {
              ...specialty,
            },
            { id: 456 },
          ];
          expectedResult = service.addSpecialtyToCollectionIfMissing(specialtyCollection, specialty);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Specialty to an array that doesn't contain it", () => {
          const specialty: ISpecialty = { id: 123 };
          const specialtyCollection: ISpecialty[] = [{ id: 456 }];
          expectedResult = service.addSpecialtyToCollectionIfMissing(specialtyCollection, specialty);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(specialty);
        });

        it('should add only unique Specialty to an array', () => {
          const specialtyArray: ISpecialty[] = [{ id: 123 }, { id: 456 }, { id: 43574 }];
          const specialtyCollection: ISpecialty[] = [{ id: 123 }];
          expectedResult = service.addSpecialtyToCollectionIfMissing(specialtyCollection, ...specialtyArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const specialty: ISpecialty = { id: 123 };
          const specialty2: ISpecialty = { id: 456 };
          expectedResult = service.addSpecialtyToCollectionIfMissing([], specialty, specialty2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(specialty);
          expect(expectedResult).toContain(specialty2);
        });

        it('should accept null and undefined values', () => {
          const specialty: ISpecialty = { id: 123 };
          expectedResult = service.addSpecialtyToCollectionIfMissing([], null, specialty, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(specialty);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
