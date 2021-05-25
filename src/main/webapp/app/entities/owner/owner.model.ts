import { IPet } from 'app/entities/pet/pet.model';

export interface IOwner {
  id?: number;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  telephone?: string;
  pets?: IPet[] | null;
}

export class Owner implements IOwner {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public address?: string,
    public city?: string,
    public telephone?: string,
    public pets?: IPet[] | null
  ) {}
}

export function getOwnerIdentifier(owner: IOwner): number | undefined {
  return owner.id;
}
