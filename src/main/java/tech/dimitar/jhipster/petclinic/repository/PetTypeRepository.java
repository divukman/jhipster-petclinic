package tech.dimitar.jhipster.petclinic.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import tech.dimitar.jhipster.petclinic.domain.PetType;

/**
 * Spring Data SQL repository for the PetType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PetTypeRepository extends JpaRepository<PetType, Long> {}
