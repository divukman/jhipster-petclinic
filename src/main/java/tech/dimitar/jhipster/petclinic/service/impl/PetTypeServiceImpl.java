package tech.dimitar.jhipster.petclinic.service.impl;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.dimitar.jhipster.petclinic.domain.PetType;
import tech.dimitar.jhipster.petclinic.repository.PetTypeRepository;
import tech.dimitar.jhipster.petclinic.service.PetTypeService;
import tech.dimitar.jhipster.petclinic.service.dto.PetTypeDTO;
import tech.dimitar.jhipster.petclinic.service.mapper.PetTypeMapper;

/**
 * Service Implementation for managing {@link PetType}.
 */
@Service
@Transactional
public class PetTypeServiceImpl implements PetTypeService {

    private final Logger log = LoggerFactory.getLogger(PetTypeServiceImpl.class);

    private final PetTypeRepository petTypeRepository;

    private final PetTypeMapper petTypeMapper;

    public PetTypeServiceImpl(PetTypeRepository petTypeRepository, PetTypeMapper petTypeMapper) {
        this.petTypeRepository = petTypeRepository;
        this.petTypeMapper = petTypeMapper;
    }

    @Override
    public PetTypeDTO save(PetTypeDTO petTypeDTO) {
        log.debug("Request to save PetType : {}", petTypeDTO);
        PetType petType = petTypeMapper.toEntity(petTypeDTO);
        petType = petTypeRepository.save(petType);
        return petTypeMapper.toDto(petType);
    }

    @Override
    public Optional<PetTypeDTO> partialUpdate(PetTypeDTO petTypeDTO) {
        log.debug("Request to partially update PetType : {}", petTypeDTO);

        return petTypeRepository
            .findById(petTypeDTO.getId())
            .map(
                existingPetType -> {
                    petTypeMapper.partialUpdate(existingPetType, petTypeDTO);
                    return existingPetType;
                }
            )
            .map(petTypeRepository::save)
            .map(petTypeMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PetTypeDTO> findAll(Pageable pageable) {
        log.debug("Request to get all PetTypes");
        return petTypeRepository.findAll(pageable).map(petTypeMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PetTypeDTO> findOne(Long id) {
        log.debug("Request to get PetType : {}", id);
        return petTypeRepository.findById(id).map(petTypeMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete PetType : {}", id);
        petTypeRepository.deleteById(id);
    }
}
