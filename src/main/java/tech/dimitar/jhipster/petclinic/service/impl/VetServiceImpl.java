package tech.dimitar.jhipster.petclinic.service.impl;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.dimitar.jhipster.petclinic.domain.Vet;
import tech.dimitar.jhipster.petclinic.repository.VetRepository;
import tech.dimitar.jhipster.petclinic.service.VetService;
import tech.dimitar.jhipster.petclinic.service.dto.VetDTO;
import tech.dimitar.jhipster.petclinic.service.mapper.VetMapper;

/**
 * Service Implementation for managing {@link Vet}.
 */
@Service
@Transactional
public class VetServiceImpl implements VetService {

    private final Logger log = LoggerFactory.getLogger(VetServiceImpl.class);

    private final VetRepository vetRepository;

    private final VetMapper vetMapper;

    public VetServiceImpl(VetRepository vetRepository, VetMapper vetMapper) {
        this.vetRepository = vetRepository;
        this.vetMapper = vetMapper;
    }

    @Override
    public VetDTO save(VetDTO vetDTO) {
        log.debug("Request to save Vet : {}", vetDTO);
        Vet vet = vetMapper.toEntity(vetDTO);
        vet = vetRepository.save(vet);
        return vetMapper.toDto(vet);
    }

    @Override
    public Optional<VetDTO> partialUpdate(VetDTO vetDTO) {
        log.debug("Request to partially update Vet : {}", vetDTO);

        return vetRepository
            .findById(vetDTO.getId())
            .map(
                existingVet -> {
                    vetMapper.partialUpdate(existingVet, vetDTO);
                    return existingVet;
                }
            )
            .map(vetRepository::save)
            .map(vetMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VetDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Vets");
        return vetRepository.findAll(pageable).map(vetMapper::toDto);
    }

    public Page<VetDTO> findAllWithEagerRelationships(Pageable pageable) {
        return vetRepository.findAllWithEagerRelationships(pageable).map(vetMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<VetDTO> findOne(Long id) {
        log.debug("Request to get Vet : {}", id);
        return vetRepository.findOneWithEagerRelationships(id).map(vetMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Vet : {}", id);
        vetRepository.deleteById(id);
    }
}
