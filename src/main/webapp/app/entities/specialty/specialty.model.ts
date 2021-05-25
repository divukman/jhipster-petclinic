import { IVet } from 'app/entities/vet/vet.model';

export interface ISpecialty {
  id?: number;
  name?: string;
  vets?: IVet[] | null;
}

export class Specialty implements ISpecialty {
  constructor(public id?: number, public name?: string, public vets?: IVet[] | null) {}
}

export function getSpecialtyIdentifier(specialty: ISpecialty): number | undefined {
  return specialty.id;
}
