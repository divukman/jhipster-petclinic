import * as dayjs from 'dayjs';
import { IVisit } from 'app/entities/visit/visit.model';
import { IPetType } from 'app/entities/pet-type/pet-type.model';
import { IOwner } from 'app/entities/owner/owner.model';

export interface IPet {
  id?: number;
  name?: string;
  birthDate?: dayjs.Dayjs | null;
  visits?: IVisit[] | null;
  type?: IPetType | null;
  owner?: IOwner | null;
}

export class Pet implements IPet {
  constructor(
    public id?: number,
    public name?: string,
    public birthDate?: dayjs.Dayjs | null,
    public visits?: IVisit[] | null,
    public type?: IPetType | null,
    public owner?: IOwner | null
  ) {}
}

export function getPetIdentifier(pet: IPet): number | undefined {
  return pet.id;
}
