import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPetType, PetType } from '../pet-type.model';
import { PetTypeService } from '../service/pet-type.service';

@Injectable({ providedIn: 'root' })
export class PetTypeRoutingResolveService implements Resolve<IPetType> {
  constructor(protected service: PetTypeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPetType> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((petType: HttpResponse<PetType>) => {
          if (petType.body) {
            return of(petType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PetType());
  }
}
