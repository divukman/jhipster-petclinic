import * as dayjs from 'dayjs';
import { IPet } from 'app/entities/pet/pet.model';

export interface IVisit {
  id?: number;
  visitDate?: dayjs.Dayjs | null;
  description?: string;
  pet?: IPet | null;
}

export class Visit implements IVisit {
  constructor(public id?: number, public visitDate?: dayjs.Dayjs | null, public description?: string, public pet?: IPet | null) {}
}

export function getVisitIdentifier(visit: IVisit): number | undefined {
  return visit.id;
}
