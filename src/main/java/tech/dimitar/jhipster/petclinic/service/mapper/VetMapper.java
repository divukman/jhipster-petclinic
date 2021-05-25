package tech.dimitar.jhipster.petclinic.service.mapper;

import java.util.Set;
import org.mapstruct.*;
import tech.dimitar.jhipster.petclinic.domain.*;
import tech.dimitar.jhipster.petclinic.service.dto.VetDTO;

/**
 * Mapper for the entity {@link Vet} and its DTO {@link VetDTO}.
 */
@Mapper(componentModel = "spring", uses = { SpecialtyMapper.class })
public interface VetMapper extends EntityMapper<VetDTO, Vet> {
    @Mapping(target = "specialties", source = "specialties", qualifiedByName = "nameSet")
    VetDTO toDto(Vet s);

    @Mapping(target = "removeSpecialties", ignore = true)
    Vet toEntity(VetDTO vetDTO);
}
