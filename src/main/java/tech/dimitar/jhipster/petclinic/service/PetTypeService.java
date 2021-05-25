package tech.dimitar.jhipster.petclinic.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tech.dimitar.jhipster.petclinic.service.dto.PetTypeDTO;

/**
 * Service Interface for managing {@link tech.dimitar.jhipster.petclinic.domain.PetType}.
 */
public interface PetTypeService {
    /**
     * Save a petType.
     *
     * @param petTypeDTO the entity to save.
     * @return the persisted entity.
     */
    PetTypeDTO save(PetTypeDTO petTypeDTO);

    /**
     * Partially updates a petType.
     *
     * @param petTypeDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<PetTypeDTO> partialUpdate(PetTypeDTO petTypeDTO);

    /**
     * Get all the petTypes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<PetTypeDTO> findAll(Pageable pageable);

    /**
     * Get the "id" petType.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<PetTypeDTO> findOne(Long id);

    /**
     * Delete the "id" petType.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
