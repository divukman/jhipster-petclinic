jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPetType, PetType } from '../pet-type.model';
import { PetTypeService } from '../service/pet-type.service';

import { PetTypeRoutingResolveService } from './pet-type-routing-resolve.service';

describe('Service Tests', () => {
  describe('PetType routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PetTypeRoutingResolveService;
    let service: PetTypeService;
    let resultPetType: IPetType | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PetTypeRoutingResolveService);
      service = TestBed.inject(PetTypeService);
      resultPetType = undefined;
    });

    describe('resolve', () => {
      it('should return IPetType returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPetType = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPetType).toEqual({ id: 123 });
      });

      it('should return new IPetType if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPetType = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPetType).toEqual(new PetType());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPetType = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPetType).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
