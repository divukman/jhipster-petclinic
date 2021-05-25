package tech.dimitar.jhipster.petclinic.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import tech.dimitar.jhipster.petclinic.domain.Owner;

/**
 * Spring Data SQL repository for the Owner entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long>, JpaSpecificationExecutor<Owner> {}
