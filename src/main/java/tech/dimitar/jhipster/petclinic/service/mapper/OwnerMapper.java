package tech.dimitar.jhipster.petclinic.service.mapper;

import org.mapstruct.*;
import tech.dimitar.jhipster.petclinic.domain.*;
import tech.dimitar.jhipster.petclinic.service.dto.OwnerDTO;

/**
 * Mapper for the entity {@link Owner} and its DTO {@link OwnerDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface OwnerMapper extends EntityMapper<OwnerDTO, Owner> {
    @Named("lastName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "lastName", source = "lastName")
    OwnerDTO toDtoLastName(Owner owner);
}
