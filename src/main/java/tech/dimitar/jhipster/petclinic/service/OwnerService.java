package tech.dimitar.jhipster.petclinic.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tech.dimitar.jhipster.petclinic.service.dto.OwnerDTO;

/**
 * Service Interface for managing {@link tech.dimitar.jhipster.petclinic.domain.Owner}.
 */
public interface OwnerService {
    /**
     * Save a owner.
     *
     * @param ownerDTO the entity to save.
     * @return the persisted entity.
     */
    OwnerDTO save(OwnerDTO ownerDTO);

    /**
     * Partially updates a owner.
     *
     * @param ownerDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<OwnerDTO> partialUpdate(OwnerDTO ownerDTO);

    /**
     * Get all the owners.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<OwnerDTO> findAll(Pageable pageable);

    /**
     * Get the "id" owner.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<OwnerDTO> findOne(Long id);

    /**
     * Delete the "id" owner.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
