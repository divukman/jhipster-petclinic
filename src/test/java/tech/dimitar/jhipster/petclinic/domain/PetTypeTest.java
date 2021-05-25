package tech.dimitar.jhipster.petclinic.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import tech.dimitar.jhipster.petclinic.web.rest.TestUtil;

class PetTypeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PetType.class);
        PetType petType1 = new PetType();
        petType1.setId(1L);
        PetType petType2 = new PetType();
        petType2.setId(petType1.getId());
        assertThat(petType1).isEqualTo(petType2);
        petType2.setId(2L);
        assertThat(petType1).isNotEqualTo(petType2);
        petType1.setId(null);
        assertThat(petType1).isNotEqualTo(petType2);
    }
}
