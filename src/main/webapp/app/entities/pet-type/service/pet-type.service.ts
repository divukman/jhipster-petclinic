import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPetType, getPetTypeIdentifier } from '../pet-type.model';

export type EntityResponseType = HttpResponse<IPetType>;
export type EntityArrayResponseType = HttpResponse<IPetType[]>;

@Injectable({ providedIn: 'root' })
export class PetTypeService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/pet-types');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(petType: IPetType): Observable<EntityResponseType> {
    return this.http.post<IPetType>(this.resourceUrl, petType, { observe: 'response' });
  }

  update(petType: IPetType): Observable<EntityResponseType> {
    return this.http.put<IPetType>(`${this.resourceUrl}/${getPetTypeIdentifier(petType) as number}`, petType, { observe: 'response' });
  }

  partialUpdate(petType: IPetType): Observable<EntityResponseType> {
    return this.http.patch<IPetType>(`${this.resourceUrl}/${getPetTypeIdentifier(petType) as number}`, petType, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPetType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPetType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPetTypeToCollectionIfMissing(petTypeCollection: IPetType[], ...petTypesToCheck: (IPetType | null | undefined)[]): IPetType[] {
    const petTypes: IPetType[] = petTypesToCheck.filter(isPresent);
    if (petTypes.length > 0) {
      const petTypeCollectionIdentifiers = petTypeCollection.map(petTypeItem => getPetTypeIdentifier(petTypeItem)!);
      const petTypesToAdd = petTypes.filter(petTypeItem => {
        const petTypeIdentifier = getPetTypeIdentifier(petTypeItem);
        if (petTypeIdentifier == null || petTypeCollectionIdentifiers.includes(petTypeIdentifier)) {
          return false;
        }
        petTypeCollectionIdentifiers.push(petTypeIdentifier);
        return true;
      });
      return [...petTypesToAdd, ...petTypeCollection];
    }
    return petTypeCollection;
  }
}
