export interface IPetType {
  id?: number;
  name?: string;
}

export class PetType implements IPetType {
  constructor(public id?: number, public name?: string) {}
}

export function getPetTypeIdentifier(petType: IPetType): number | undefined {
  return petType.id;
}
