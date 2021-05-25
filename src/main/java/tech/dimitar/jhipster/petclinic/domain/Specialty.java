package tech.dimitar.jhipster.petclinic.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Specialty.
 */
@Entity
@Table(name = "specialties")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Specialty implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 80)
    @Column(name = "name", length = 80, nullable = false)
    private String name;

    @ManyToMany(mappedBy = "specialties")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "specialties" }, allowSetters = true)
    private Set<Vet> vets = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Specialty id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Specialty name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Vet> getVets() {
        return this.vets;
    }

    public Specialty vets(Set<Vet> vets) {
        this.setVets(vets);
        return this;
    }

    public Specialty addVets(Vet vet) {
        this.vets.add(vet);
        vet.getSpecialties().add(this);
        return this;
    }

    public Specialty removeVets(Vet vet) {
        this.vets.remove(vet);
        vet.getSpecialties().remove(this);
        return this;
    }

    public void setVets(Set<Vet> vets) {
        if (this.vets != null) {
            this.vets.forEach(i -> i.removeSpecialties(this));
        }
        if (vets != null) {
            vets.forEach(i -> i.addSpecialties(this));
        }
        this.vets = vets;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Specialty)) {
            return false;
        }
        return id != null && id.equals(((Specialty) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Specialty{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
