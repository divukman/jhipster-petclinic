package tech.dimitar.jhipster.petclinic.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import tech.dimitar.jhipster.petclinic.domain.Specialty;

/**
 * Spring Data SQL repository for the Specialty entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SpecialtyRepository extends JpaRepository<Specialty, Long> {}
