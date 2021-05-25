package tech.dimitar.jhipster.petclinic.service.mapper;

import org.mapstruct.*;
import tech.dimitar.jhipster.petclinic.domain.*;
import tech.dimitar.jhipster.petclinic.service.dto.VisitDTO;

/**
 * Mapper for the entity {@link Visit} and its DTO {@link VisitDTO}.
 */
@Mapper(componentModel = "spring", uses = { PetMapper.class })
public interface VisitMapper extends EntityMapper<VisitDTO, Visit> {
    @Mapping(target = "pet", source = "pet", qualifiedByName = "name")
    VisitDTO toDto(Visit s);
}
