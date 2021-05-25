package tech.dimitar.jhipster.petclinic.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import tech.dimitar.jhipster.petclinic.domain.Pet;

/**
 * Spring Data SQL repository for the Pet entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PetRepository extends JpaRepository<Pet, Long>, JpaSpecificationExecutor<Pet> {}
