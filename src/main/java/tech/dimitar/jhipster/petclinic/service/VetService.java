package tech.dimitar.jhipster.petclinic.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tech.dimitar.jhipster.petclinic.service.dto.VetDTO;

/**
 * Service Interface for managing {@link tech.dimitar.jhipster.petclinic.domain.Vet}.
 */
public interface VetService {
    /**
     * Save a vet.
     *
     * @param vetDTO the entity to save.
     * @return the persisted entity.
     */
    VetDTO save(VetDTO vetDTO);

    /**
     * Partially updates a vet.
     *
     * @param vetDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<VetDTO> partialUpdate(VetDTO vetDTO);

    /**
     * Get all the vets.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<VetDTO> findAll(Pageable pageable);

    /**
     * Get all the vets with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<VetDTO> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" vet.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<VetDTO> findOne(Long id);

    /**
     * Delete the "id" vet.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
