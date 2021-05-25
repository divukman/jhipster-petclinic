package tech.dimitar.jhipster.petclinic.service.mapper;

import org.mapstruct.*;
import tech.dimitar.jhipster.petclinic.domain.*;
import tech.dimitar.jhipster.petclinic.service.dto.PetTypeDTO;

/**
 * Mapper for the entity {@link PetType} and its DTO {@link PetTypeDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface PetTypeMapper extends EntityMapper<PetTypeDTO, PetType> {
    @Named("name")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    PetTypeDTO toDtoName(PetType petType);
}
