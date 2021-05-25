import { ISpecialty } from 'app/entities/specialty/specialty.model';

export interface IVet {
  id?: number;
  firstName?: string;
  lastName?: string;
  specialties?: ISpecialty[] | null;
}

export class Vet implements IVet {
  constructor(public id?: number, public firstName?: string, public lastName?: string, public specialties?: ISpecialty[] | null) {}
}

export function getVetIdentifier(vet: IVet): number | undefined {
  return vet.id;
}
