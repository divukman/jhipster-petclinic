import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVet, Vet } from '../vet.model';
import { VetService } from '../service/vet.service';

@Injectable({ providedIn: 'root' })
export class VetRoutingResolveService implements Resolve<IVet> {
  constructor(protected service: VetService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVet> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((vet: HttpResponse<Vet>) => {
          if (vet.body) {
            return of(vet.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Vet());
  }
}
