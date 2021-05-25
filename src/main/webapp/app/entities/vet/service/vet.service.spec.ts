import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVet, Vet } from '../vet.model';

import { VetService } from './vet.service';

describe('Service Tests', () => {
  describe('Vet Service', () => {
    let service: VetService;
    let httpMock: HttpTestingController;
    let elemDefault: IVet;
    let expectedResult: IVet | IVet[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(VetService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        firstName: 'AAAAAAA',
        lastName: 'AAAAAAA',
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

      it('should create a Vet', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Vet()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Vet', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Vet', () => {
        const patchObject = Object.assign({}, new Vet());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Vet', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
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

      it('should delete a Vet', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addVetToCollectionIfMissing', () => {
        it('should add a Vet to an empty array', () => {
          const vet: IVet = { id: 123 };
          expectedResult = service.addVetToCollectionIfMissing([], vet);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(vet);
        });

        it('should not add a Vet to an array that contains it', () => {
          const vet: IVet = { id: 123 };
          const vetCollection: IVet[] = [
            {
              ...vet,
            },
            { id: 456 },
          ];
          expectedResult = service.addVetToCollectionIfMissing(vetCollection, vet);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Vet to an array that doesn't contain it", () => {
          const vet: IVet = { id: 123 };
          const vetCollection: IVet[] = [{ id: 456 }];
          expectedResult = service.addVetToCollectionIfMissing(vetCollection, vet);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(vet);
        });

        it('should add only unique Vet to an array', () => {
          const vetArray: IVet[] = [{ id: 123 }, { id: 456 }, { id: 73262 }];
          const vetCollection: IVet[] = [{ id: 123 }];
          expectedResult = service.addVetToCollectionIfMissing(vetCollection, ...vetArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const vet: IVet = { id: 123 };
          const vet2: IVet = { id: 456 };
          expectedResult = service.addVetToCollectionIfMissing([], vet, vet2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(vet);
          expect(expectedResult).toContain(vet2);
        });

        it('should accept null and undefined values', () => {
          const vet: IVet = { id: 123 };
          expectedResult = service.addVetToCollectionIfMissing([], null, vet, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(vet);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
