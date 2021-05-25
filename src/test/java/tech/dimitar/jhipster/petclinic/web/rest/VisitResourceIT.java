package tech.dimitar.jhipster.petclinic.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import tech.dimitar.jhipster.petclinic.IntegrationTest;
import tech.dimitar.jhipster.petclinic.domain.Pet;
import tech.dimitar.jhipster.petclinic.domain.Visit;
import tech.dimitar.jhipster.petclinic.repository.VisitRepository;
import tech.dimitar.jhipster.petclinic.service.criteria.VisitCriteria;
import tech.dimitar.jhipster.petclinic.service.dto.VisitDTO;
import tech.dimitar.jhipster.petclinic.service.mapper.VisitMapper;

/**
 * Integration tests for the {@link VisitResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VisitResourceIT {

    private static final LocalDate DEFAULT_VISIT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_VISIT_DATE = LocalDate.now(ZoneId.systemDefault());
    private static final LocalDate SMALLER_VISIT_DATE = LocalDate.ofEpochDay(-1L);

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/visits";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VisitRepository visitRepository;

    @Autowired
    private VisitMapper visitMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVisitMockMvc;

    private Visit visit;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Visit createEntity(EntityManager em) {
        Visit visit = new Visit().visitDate(DEFAULT_VISIT_DATE).description(DEFAULT_DESCRIPTION);
        return visit;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Visit createUpdatedEntity(EntityManager em) {
        Visit visit = new Visit().visitDate(UPDATED_VISIT_DATE).description(UPDATED_DESCRIPTION);
        return visit;
    }

    @BeforeEach
    public void initTest() {
        visit = createEntity(em);
    }

    @Test
    @Transactional
    void createVisit() throws Exception {
        int databaseSizeBeforeCreate = visitRepository.findAll().size();
        // Create the Visit
        VisitDTO visitDTO = visitMapper.toDto(visit);
        restVisitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(visitDTO)))
            .andExpect(status().isCreated());

        // Validate the Visit in the database
        List<Visit> visitList = visitRepository.findAll();
        assertThat(visitList).hasSize(databaseSizeBeforeCreate + 1);
        Visit testVisit = visitList.get(visitList.size() - 1);
        assertThat(testVisit.getVisitDate()).isEqualTo(DEFAULT_VISIT_DATE);
        assertThat(testVisit.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createVisitWithExistingId() throws Exception {
        // Create the Visit with an existing ID
        visit.setId(1L);
        VisitDTO visitDTO = visitMapper.toDto(visit);

        int databaseSizeBeforeCreate = visitRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVisitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(visitDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Visit in the database
        List<Visit> visitList = visitRepository.findAll();
        assertThat(visitList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = visitRepository.findAll().size();
        // set the field null
        visit.setDescription(null);

        // Create the Visit, which fails.
        VisitDTO visitDTO = visitMapper.toDto(visit);

        restVisitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(visitDTO)))
            .andExpect(status().isBadRequest());

        List<Visit> visitList = visitRepository.findAll();
        assertThat(visitList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllVisits() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        // Get all the visitList
        restVisitMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(visit.getId().intValue())))
            .andExpect(jsonPath("$.[*].visitDate").value(hasItem(DEFAULT_VISIT_DATE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getVisit() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        // Get the visit
        restVisitMockMvc
            .perform(get(ENTITY_API_URL_ID, visit.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(visit.getId().intValue()))
            .andExpect(jsonPath("$.visitDate").value(DEFAULT_VISIT_DATE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getVisitsByIdFiltering() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        Long id = visit.getId();

        defaultVisitShouldBeFound("id.equals=" + id);
        defaultVisitShouldNotBeFound("id.notEquals=" + id);

        defaultVisitShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultVisitShouldNotBeFound("id.greaterThan=" + id);

        defaultVisitShouldBeFound("id.lessThanOrEqual=" + id);
        defaultVisitShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllVisitsByVisitDateIsEqualToSomething() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        // Get all the visitList where visitDate equals to DEFAULT_VISIT_DATE
        defaultVisitShouldBeFound("visitDate.equals=" + DEFAULT_VISIT_DATE);

        // Get all the visitList where visitDate equals to UPDATED_VISIT_DATE
        defaultVisitShouldNotBeFound("visitDate.equals=" + UPDATED_VISIT_DATE);
    }

    @Test
    @Transactional
    void getAllVisitsByVisitDateIsNotEqualToSomething() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        // Get all the visitList where visitDate not equals to DEFAULT_VISIT_DATE
        defaultVisitShouldNotBeFound("visitDate.notEquals=" + DEFAULT_VISIT_DATE);

        // Get all the visitList where visitDate not equals to UPDATED_VISIT_DATE
        defaultVisitShouldBeFound("visitDate.notEquals=" + UPDATED_VISIT_DATE);
    }

    @Test
    @Transactional
    void getAllVisitsByVisitDateIsInShouldWork() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        // Get all the visitList where visitDate in DEFAULT_VISIT_DATE or UPDATED_VISIT_DATE
        defaultVisitShouldBeFound("visitDate.in=" + DEFAULT_VISIT_DATE + "," + UPDATED_VISIT_DATE);

        // Get all the visitList where visitDate equals to UPDATED_VISIT_DATE
        defaultVisitShouldNotBeFound("visitDate.in=" + UPDATED_VISIT_DATE);
    }

    @Test
    @Transactional
    void getAllVisitsByVisitDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        // Get all the visitList where visitDate is not null
        defaultVisitShouldBeFound("visitDate.specified=true");

        // Get all the visitList where visitDate is null
        defaultVisitShouldNotBeFound("visitDate.specified=false");
    }

    @Test
    @Transactional
    void getAllVisitsByVisitDateIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        // Get all the visitList where visitDate is greater than or equal to DEFAULT_VISIT_DATE
        defaultVisitShouldBeFound("visitDate.greaterThanOrEqual=" + DEFAULT_VISIT_DATE);

        // Get all the visitList where visitDate is greater than or equal to UPDATED_VISIT_DATE
        defaultVisitShouldNotBeFound("visitDate.greaterThanOrEqual=" + UPDATED_VISIT_DATE);
    }

    @Test
    @Transactional
    void getAllVisitsByVisitDateIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        // Get all the visitList where visitDate is less than or equal to DEFAULT_VISIT_DATE
        defaultVisitShouldBeFound("visitDate.lessThanOrEqual=" + DEFAULT_VISIT_DATE);

        // Get all the visitList where visitDate is less than or equal to SMALLER_VISIT_DATE
        defaultVisitShouldNotBeFound("visitDate.lessThanOrEqual=" + SMALLER_VISIT_DATE);
    }

    @Test
    @Transactional
    void getAllVisitsByVisitDateIsLessThanSomething() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        // Get all the visitList where visitDate is less than DEFAULT_VISIT_DATE
        defaultVisitShouldNotBeFound("visitDate.lessThan=" + DEFAULT_VISIT_DATE);

        // Get all the visitList where visitDate is less than UPDATED_VISIT_DATE
        defaultVisitShouldBeFound("visitDate.lessThan=" + UPDATED_VISIT_DATE);
    }

    @Test
    @Transactional
    void getAllVisitsByVisitDateIsGreaterThanSomething() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        // Get all the visitList where visitDate is greater than DEFAULT_VISIT_DATE
        defaultVisitShouldNotBeFound("visitDate.greaterThan=" + DEFAULT_VISIT_DATE);

        // Get all the visitList where visitDate is greater than SMALLER_VISIT_DATE
        defaultVisitShouldBeFound("visitDate.greaterThan=" + SMALLER_VISIT_DATE);
    }

    @Test
    @Transactional
    void getAllVisitsByDescriptionIsEqualToSomething() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        // Get all the visitList where description equals to DEFAULT_DESCRIPTION
        defaultVisitShouldBeFound("description.equals=" + DEFAULT_DESCRIPTION);

        // Get all the visitList where description equals to UPDATED_DESCRIPTION
        defaultVisitShouldNotBeFound("description.equals=" + UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllVisitsByDescriptionIsNotEqualToSomething() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        // Get all the visitList where description not equals to DEFAULT_DESCRIPTION
        defaultVisitShouldNotBeFound("description.notEquals=" + DEFAULT_DESCRIPTION);

        // Get all the visitList where description not equals to UPDATED_DESCRIPTION
        defaultVisitShouldBeFound("description.notEquals=" + UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllVisitsByDescriptionIsInShouldWork() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        // Get all the visitList where description in DEFAULT_DESCRIPTION or UPDATED_DESCRIPTION
        defaultVisitShouldBeFound("description.in=" + DEFAULT_DESCRIPTION + "," + UPDATED_DESCRIPTION);

        // Get all the visitList where description equals to UPDATED_DESCRIPTION
        defaultVisitShouldNotBeFound("description.in=" + UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllVisitsByDescriptionIsNullOrNotNull() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        // Get all the visitList where description is not null
        defaultVisitShouldBeFound("description.specified=true");

        // Get all the visitList where description is null
        defaultVisitShouldNotBeFound("description.specified=false");
    }

    @Test
    @Transactional
    void getAllVisitsByDescriptionContainsSomething() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        // Get all the visitList where description contains DEFAULT_DESCRIPTION
        defaultVisitShouldBeFound("description.contains=" + DEFAULT_DESCRIPTION);

        // Get all the visitList where description contains UPDATED_DESCRIPTION
        defaultVisitShouldNotBeFound("description.contains=" + UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllVisitsByDescriptionNotContainsSomething() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        // Get all the visitList where description does not contain DEFAULT_DESCRIPTION
        defaultVisitShouldNotBeFound("description.doesNotContain=" + DEFAULT_DESCRIPTION);

        // Get all the visitList where description does not contain UPDATED_DESCRIPTION
        defaultVisitShouldBeFound("description.doesNotContain=" + UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllVisitsByPetIsEqualToSomething() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);
        Pet pet = PetResourceIT.createEntity(em);
        em.persist(pet);
        em.flush();
        visit.setPet(pet);
        visitRepository.saveAndFlush(visit);
        Long petId = pet.getId();

        // Get all the visitList where pet equals to petId
        defaultVisitShouldBeFound("petId.equals=" + petId);

        // Get all the visitList where pet equals to (petId + 1)
        defaultVisitShouldNotBeFound("petId.equals=" + (petId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultVisitShouldBeFound(String filter) throws Exception {
        restVisitMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(visit.getId().intValue())))
            .andExpect(jsonPath("$.[*].visitDate").value(hasItem(DEFAULT_VISIT_DATE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));

        // Check, that the count call also returns 1
        restVisitMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultVisitShouldNotBeFound(String filter) throws Exception {
        restVisitMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restVisitMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingVisit() throws Exception {
        // Get the visit
        restVisitMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewVisit() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        int databaseSizeBeforeUpdate = visitRepository.findAll().size();

        // Update the visit
        Visit updatedVisit = visitRepository.findById(visit.getId()).get();
        // Disconnect from session so that the updates on updatedVisit are not directly saved in db
        em.detach(updatedVisit);
        updatedVisit.visitDate(UPDATED_VISIT_DATE).description(UPDATED_DESCRIPTION);
        VisitDTO visitDTO = visitMapper.toDto(updatedVisit);

        restVisitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, visitDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(visitDTO))
            )
            .andExpect(status().isOk());

        // Validate the Visit in the database
        List<Visit> visitList = visitRepository.findAll();
        assertThat(visitList).hasSize(databaseSizeBeforeUpdate);
        Visit testVisit = visitList.get(visitList.size() - 1);
        assertThat(testVisit.getVisitDate()).isEqualTo(UPDATED_VISIT_DATE);
        assertThat(testVisit.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingVisit() throws Exception {
        int databaseSizeBeforeUpdate = visitRepository.findAll().size();
        visit.setId(count.incrementAndGet());

        // Create the Visit
        VisitDTO visitDTO = visitMapper.toDto(visit);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVisitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, visitDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(visitDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Visit in the database
        List<Visit> visitList = visitRepository.findAll();
        assertThat(visitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVisit() throws Exception {
        int databaseSizeBeforeUpdate = visitRepository.findAll().size();
        visit.setId(count.incrementAndGet());

        // Create the Visit
        VisitDTO visitDTO = visitMapper.toDto(visit);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(visitDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Visit in the database
        List<Visit> visitList = visitRepository.findAll();
        assertThat(visitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVisit() throws Exception {
        int databaseSizeBeforeUpdate = visitRepository.findAll().size();
        visit.setId(count.incrementAndGet());

        // Create the Visit
        VisitDTO visitDTO = visitMapper.toDto(visit);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisitMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(visitDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Visit in the database
        List<Visit> visitList = visitRepository.findAll();
        assertThat(visitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVisitWithPatch() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        int databaseSizeBeforeUpdate = visitRepository.findAll().size();

        // Update the visit using partial update
        Visit partialUpdatedVisit = new Visit();
        partialUpdatedVisit.setId(visit.getId());

        partialUpdatedVisit.description(UPDATED_DESCRIPTION);

        restVisitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVisit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVisit))
            )
            .andExpect(status().isOk());

        // Validate the Visit in the database
        List<Visit> visitList = visitRepository.findAll();
        assertThat(visitList).hasSize(databaseSizeBeforeUpdate);
        Visit testVisit = visitList.get(visitList.size() - 1);
        assertThat(testVisit.getVisitDate()).isEqualTo(DEFAULT_VISIT_DATE);
        assertThat(testVisit.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateVisitWithPatch() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        int databaseSizeBeforeUpdate = visitRepository.findAll().size();

        // Update the visit using partial update
        Visit partialUpdatedVisit = new Visit();
        partialUpdatedVisit.setId(visit.getId());

        partialUpdatedVisit.visitDate(UPDATED_VISIT_DATE).description(UPDATED_DESCRIPTION);

        restVisitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVisit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVisit))
            )
            .andExpect(status().isOk());

        // Validate the Visit in the database
        List<Visit> visitList = visitRepository.findAll();
        assertThat(visitList).hasSize(databaseSizeBeforeUpdate);
        Visit testVisit = visitList.get(visitList.size() - 1);
        assertThat(testVisit.getVisitDate()).isEqualTo(UPDATED_VISIT_DATE);
        assertThat(testVisit.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingVisit() throws Exception {
        int databaseSizeBeforeUpdate = visitRepository.findAll().size();
        visit.setId(count.incrementAndGet());

        // Create the Visit
        VisitDTO visitDTO = visitMapper.toDto(visit);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVisitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, visitDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(visitDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Visit in the database
        List<Visit> visitList = visitRepository.findAll();
        assertThat(visitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVisit() throws Exception {
        int databaseSizeBeforeUpdate = visitRepository.findAll().size();
        visit.setId(count.incrementAndGet());

        // Create the Visit
        VisitDTO visitDTO = visitMapper.toDto(visit);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(visitDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Visit in the database
        List<Visit> visitList = visitRepository.findAll();
        assertThat(visitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVisit() throws Exception {
        int databaseSizeBeforeUpdate = visitRepository.findAll().size();
        visit.setId(count.incrementAndGet());

        // Create the Visit
        VisitDTO visitDTO = visitMapper.toDto(visit);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisitMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(visitDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Visit in the database
        List<Visit> visitList = visitRepository.findAll();
        assertThat(visitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVisit() throws Exception {
        // Initialize the database
        visitRepository.saveAndFlush(visit);

        int databaseSizeBeforeDelete = visitRepository.findAll().size();

        // Delete the visit
        restVisitMockMvc
            .perform(delete(ENTITY_API_URL_ID, visit.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Visit> visitList = visitRepository.findAll();
        assertThat(visitList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
