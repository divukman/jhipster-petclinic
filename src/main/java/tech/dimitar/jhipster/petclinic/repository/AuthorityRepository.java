package tech.dimitar.jhipster.petclinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tech.dimitar.jhipster.petclinic.domain.Authority;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
