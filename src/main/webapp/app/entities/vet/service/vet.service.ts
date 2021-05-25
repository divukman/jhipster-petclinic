import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVet, getVetIdentifier } from '../vet.model';

export type EntityResponseType = HttpResponse<IVet>;
export type EntityArrayResponseType = HttpResponse<IVet[]>;

@Injectable({ providedIn: 'root' })
export class VetService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/vets');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(vet: IVet): Observable<EntityResponseType> {
    return this.http.post<IVet>(this.resourceUrl, vet, { observe: 'response' });
  }

  update(vet: IVet): Observable<EntityResponseType> {
    return this.http.put<IVet>(`${this.resourceUrl}/${getVetIdentifier(vet) as number}`, vet, { observe: 'response' });
  }

  partialUpdate(vet: IVet): Observable<EntityResponseType> {
    return this.http.patch<IVet>(`${this.resourceUrl}/${getVetIdentifier(vet) as number}`, vet, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVet>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVet[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVetToCollectionIfMissing(vetCollection: IVet[], ...vetsToCheck: (IVet | null | undefined)[]): IVet[] {
    const vets: IVet[] = vetsToCheck.filter(isPresent);
    if (vets.length > 0) {
      const vetCollectionIdentifiers = vetCollection.map(vetItem => getVetIdentifier(vetItem)!);
      const vetsToAdd = vets.filter(vetItem => {
        const vetIdentifier = getVetIdentifier(vetItem);
        if (vetIdentifier == null || vetCollectionIdentifiers.includes(vetIdentifier)) {
          return false;
        }
        vetCollectionIdentifiers.push(vetIdentifier);
        return true;
      });
      return [...vetsToAdd, ...vetCollection];
    }
    return vetCollection;
  }
}
