package tech.dimitar.jhipster.petclinic.service.impl;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.dimitar.jhipster.petclinic.domain.Owner;
import tech.dimitar.jhipster.petclinic.repository.OwnerRepository;
import tech.dimitar.jhipster.petclinic.service.OwnerService;
import tech.dimitar.jhipster.petclinic.service.dto.OwnerDTO;
import tech.dimitar.jhipster.petclinic.service.mapper.OwnerMapper;

/**
 * Service Implementation for managing {@link Owner}.
 */
@Service
@Transactional
public class OwnerServiceImpl implements OwnerService {

    private final Logger log = LoggerFactory.getLogger(OwnerServiceImpl.class);

    private final OwnerRepository ownerRepository;

    private final OwnerMapper ownerMapper;

    public OwnerServiceImpl(OwnerRepository ownerRepository, OwnerMapper ownerMapper) {
        this.ownerRepository = ownerRepository;
        this.ownerMapper = ownerMapper;
    }

    @Override
    public OwnerDTO save(OwnerDTO ownerDTO) {
        log.debug("Request to save Owner : {}", ownerDTO);
        Owner owner = ownerMapper.toEntity(ownerDTO);
        owner = ownerRepository.save(owner);
        return ownerMapper.toDto(owner);
    }

    @Override
    public Optional<OwnerDTO> partialUpdate(OwnerDTO ownerDTO) {
        log.debug("Request to partially update Owner : {}", ownerDTO);

        return ownerRepository
            .findById(ownerDTO.getId())
            .map(
                existingOwner -> {
                    ownerMapper.partialUpdate(existingOwner, ownerDTO);
                    return existingOwner;
                }
            )
            .map(ownerRepository::save)
            .map(ownerMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OwnerDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Owners");
        return ownerRepository.findAll(pageable).map(ownerMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OwnerDTO> findOne(Long id) {
        log.debug("Request to get Owner : {}", id);
        return ownerRepository.findById(id).map(ownerMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Owner : {}", id);
        ownerRepository.deleteById(id);
    }
}
