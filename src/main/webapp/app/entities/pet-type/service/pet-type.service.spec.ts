import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPetType, PetType } from '../pet-type.model';

import { PetTypeService } from './pet-type.service';

describe('Service Tests', () => {
  describe('PetType Service', () => {
    let service: PetTypeService;
    let httpMock: HttpTestingController;
    let elemDefault: IPetType;
    let expectedResult: IPetType | IPetType[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PetTypeService);
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

      it('should create a PetType', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new PetType()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a PetType', () => {
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

      it('should partial update a PetType', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
          },
          new PetType()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of PetType', () => {
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

      it('should delete a PetType', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPetTypeToCollectionIfMissing', () => {
        it('should add a PetType to an empty array', () => {
          const petType: IPetType = { id: 123 };
          expectedResult = service.addPetTypeToCollectionIfMissing([], petType);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(petType);
        });

        it('should not add a PetType to an array that contains it', () => {
          const petType: IPetType = { id: 123 };
          const petTypeCollection: IPetType[] = [
            {
              ...petType,
            },
            { id: 456 },
          ];
          expectedResult = service.addPetTypeToCollectionIfMissing(petTypeCollection, petType);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a PetType to an array that doesn't contain it", () => {
          const petType: IPetType = { id: 123 };
          const petTypeCollection: IPetType[] = [{ id: 456 }];
          expectedResult = service.addPetTypeToCollectionIfMissing(petTypeCollection, petType);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(petType);
        });

        it('should add only unique PetType to an array', () => {
          const petTypeArray: IPetType[] = [{ id: 123 }, { id: 456 }, { id: 75057 }];
          const petTypeCollection: IPetType[] = [{ id: 123 }];
          expectedResult = service.addPetTypeToCollectionIfMissing(petTypeCollection, ...petTypeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const petType: IPetType = { id: 123 };
          const petType2: IPetType = { id: 456 };
          expectedResult = service.addPetTypeToCollectionIfMissing([], petType, petType2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(petType);
          expect(expectedResult).toContain(petType2);
        });

        it('should accept null and undefined values', () => {
          const petType: IPetType = { id: 123 };
          expectedResult = service.addPetTypeToCollectionIfMissing([], null, petType, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(petType);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
