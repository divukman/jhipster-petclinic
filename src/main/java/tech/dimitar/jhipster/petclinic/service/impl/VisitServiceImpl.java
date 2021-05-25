package tech.dimitar.jhipster.petclinic.service.impl;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.dimitar.jhipster.petclinic.domain.Visit;
import tech.dimitar.jhipster.petclinic.repository.VisitRepository;
import tech.dimitar.jhipster.petclinic.service.VisitService;
import tech.dimitar.jhipster.petclinic.service.dto.VisitDTO;
import tech.dimitar.jhipster.petclinic.service.mapper.VisitMapper;

/**
 * Service Implementation for managing {@link Visit}.
 */
@Service
@Transactional
public class VisitServiceImpl implements VisitService {

    private final Logger log = LoggerFactory.getLogger(VisitServiceImpl.class);

    private final VisitRepository visitRepository;

    private final VisitMapper visitMapper;

    public VisitServiceImpl(VisitRepository visitRepository, VisitMapper visitMapper) {
        this.visitRepository = visitRepository;
        this.visitMapper = visitMapper;
    }

    @Override
    public VisitDTO save(VisitDTO visitDTO) {
        log.debug("Request to save Visit : {}", visitDTO);
        Visit visit = visitMapper.toEntity(visitDTO);
        visit = visitRepository.save(visit);
        return visitMapper.toDto(visit);
    }

    @Override
    public Optional<VisitDTO> partialUpdate(VisitDTO visitDTO) {
        log.debug("Request to partially update Visit : {}", visitDTO);

        return visitRepository
            .findById(visitDTO.getId())
            .map(
                existingVisit -> {
                    visitMapper.partialUpdate(existingVisit, visitDTO);
                    return existingVisit;
                }
            )
            .map(visitRepository::save)
            .map(visitMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VisitDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Visits");
        return visitRepository.findAll(pageable).map(visitMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<VisitDTO> findOne(Long id) {
        log.debug("Request to get Visit : {}", id);
        return visitRepository.findById(id).map(visitMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Visit : {}", id);
        visitRepository.deleteById(id);
    }
}
