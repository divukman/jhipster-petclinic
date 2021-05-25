package tech.dimitar.jhipster.petclinic.service.mapper;

import java.util.Set;
import org.mapstruct.*;
import tech.dimitar.jhipster.petclinic.domain.*;
import tech.dimitar.jhipster.petclinic.service.dto.SpecialtyDTO;

/**
 * Mapper for the entity {@link Specialty} and its DTO {@link SpecialtyDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface SpecialtyMapper extends EntityMapper<SpecialtyDTO, Specialty> {
    @Named("nameSet")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    Set<SpecialtyDTO> toDtoNameSet(Set<Specialty> specialty);
}
