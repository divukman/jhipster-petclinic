package tech.dimitar.jhipster.petclinic.service.impl;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.dimitar.jhipster.petclinic.domain.Specialty;
import tech.dimitar.jhipster.petclinic.repository.SpecialtyRepository;
import tech.dimitar.jhipster.petclinic.service.SpecialtyService;
import tech.dimitar.jhipster.petclinic.service.dto.SpecialtyDTO;
import tech.dimitar.jhipster.petclinic.service.mapper.SpecialtyMapper;

/**
 * Service Implementation for managing {@link Specialty}.
 */
@Service
@Transactional
public class SpecialtyServiceImpl implements SpecialtyService {

    private final Logger log = LoggerFactory.getLogger(SpecialtyServiceImpl.class);

    private final SpecialtyRepository specialtyRepository;

    private final SpecialtyMapper specialtyMapper;

    public SpecialtyServiceImpl(SpecialtyRepository specialtyRepository, SpecialtyMapper specialtyMapper) {
        this.specialtyRepository = specialtyRepository;
        this.specialtyMapper = specialtyMapper;
    }

    @Override
    public SpecialtyDTO save(SpecialtyDTO specialtyDTO) {
        log.debug("Request to save Specialty : {}", specialtyDTO);
        Specialty specialty = specialtyMapper.toEntity(specialtyDTO);
        specialty = specialtyRepository.save(specialty);
        return specialtyMapper.toDto(specialty);
    }

    @Override
    public Optional<SpecialtyDTO> partialUpdate(SpecialtyDTO specialtyDTO) {
        log.debug("Request to partially update Specialty : {}", specialtyDTO);

        return specialtyRepository
            .findById(specialtyDTO.getId())
            .map(
                existingSpecialty -> {
                    specialtyMapper.partialUpdate(existingSpecialty, specialtyDTO);
                    return existingSpecialty;
                }
            )
            .map(specialtyRepository::save)
            .map(specialtyMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SpecialtyDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Specialties");
        return specialtyRepository.findAll(pageable).map(specialtyMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SpecialtyDTO> findOne(Long id) {
        log.debug("Request to get Specialty : {}", id);
        return specialtyRepository.findById(id).map(specialtyMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Specialty : {}", id);
        specialtyRepository.deleteById(id);
    }
}
