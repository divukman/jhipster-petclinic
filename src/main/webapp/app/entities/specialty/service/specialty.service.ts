import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISpecialty, getSpecialtyIdentifier } from '../specialty.model';

export type EntityResponseType = HttpResponse<ISpecialty>;
export type EntityArrayResponseType = HttpResponse<ISpecialty[]>;

@Injectable({ providedIn: 'root' })
export class SpecialtyService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/specialties');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(specialty: ISpecialty): Observable<EntityResponseType> {
    return this.http.post<ISpecialty>(this.resourceUrl, specialty, { observe: 'response' });
  }

  update(specialty: ISpecialty): Observable<EntityResponseType> {
    return this.http.put<ISpecialty>(`${this.resourceUrl}/${getSpecialtyIdentifier(specialty) as number}`, specialty, {
      observe: 'response',
    });
  }

  partialUpdate(specialty: ISpecialty): Observable<EntityResponseType> {
    return this.http.patch<ISpecialty>(`${this.resourceUrl}/${getSpecialtyIdentifier(specialty) as number}`, specialty, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISpecialty>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISpecialty[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSpecialtyToCollectionIfMissing(
    specialtyCollection: ISpecialty[],
    ...specialtiesToCheck: (ISpecialty | null | undefined)[]
  ): ISpecialty[] {
    const specialties: ISpecialty[] = specialtiesToCheck.filter(isPresent);
    if (specialties.length > 0) {
      const specialtyCollectionIdentifiers = specialtyCollection.map(specialtyItem => getSpecialtyIdentifier(specialtyItem)!);
      const specialtiesToAdd = specialties.filter(specialtyItem => {
        const specialtyIdentifier = getSpecialtyIdentifier(specialtyItem);
        if (specialtyIdentifier == null || specialtyCollectionIdentifiers.includes(specialtyIdentifier)) {
          return false;
        }
        specialtyCollectionIdentifiers.push(specialtyIdentifier);
        return true;
      });
      return [...specialtiesToAdd, ...specialtyCollection];
    }
    return specialtyCollection;
  }
}
