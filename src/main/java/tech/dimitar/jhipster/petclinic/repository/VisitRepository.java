package tech.dimitar.jhipster.petclinic.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import tech.dimitar.jhipster.petclinic.domain.Visit;

/**
 * Spring Data SQL repository for the Visit entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VisitRepository extends JpaRepository<Visit, Long>, JpaSpecificationExecutor<Visit> {}
