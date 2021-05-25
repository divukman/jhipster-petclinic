package tech.dimitar.jhipster.petclinic.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import tech.dimitar.jhipster.petclinic.web.rest.TestUtil;

class OwnerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Owner.class);
        Owner owner1 = new Owner();
        owner1.setId(1L);
        Owner owner2 = new Owner();
        owner2.setId(owner1.getId());
        assertThat(owner1).isEqualTo(owner2);
        owner2.setId(2L);
        assertThat(owner1).isNotEqualTo(owner2);
        owner1.setId(null);
        assertThat(owner1).isNotEqualTo(owner2);
    }
}
