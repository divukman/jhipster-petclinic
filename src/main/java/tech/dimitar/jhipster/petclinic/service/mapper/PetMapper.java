package tech.dimitar.jhipster.petclinic.service.mapper;

import org.mapstruct.*;
import tech.dimitar.jhipster.petclinic.domain.*;
import tech.dimitar.jhipster.petclinic.service.dto.PetDTO;

/**
 * Mapper for the entity {@link Pet} and its DTO {@link PetDTO}.
 */
@Mapper(componentModel = "spring", uses = { PetTypeMapper.class, OwnerMapper.class })
public interface PetMapper extends EntityMapper<PetDTO, Pet> {
    @Mapping(target = "type", source = "type", qualifiedByName = "name")
    @Mapping(target = "owner", source = "owner", qualifiedByName = "lastName")
    PetDTO toDto(Pet s);

    @Named("name")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    PetDTO toDtoName(Pet pet);
}
