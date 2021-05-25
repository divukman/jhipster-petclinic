package tech.dimitar.jhipster.petclinic.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Pet.
 */
@Entity
@Table(name = "pets")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Pet implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 30)
    @Column(name = "name", length = 30, nullable = false)
    private String name;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @OneToMany(mappedBy = "pet")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "pet" }, allowSetters = true)
    private Set<Visit> visits = new HashSet<>();

    @ManyToOne
    private PetType type;

    @ManyToOne
    @JsonIgnoreProperties(value = { "pets" }, allowSetters = true)
    private Owner owner;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pet id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Pet name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getBirthDate() {
        return this.birthDate;
    }

    public Pet birthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
        return this;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public Set<Visit> getVisits() {
        return this.visits;
    }

    public Pet visits(Set<Visit> visits) {
        this.setVisits(visits);
        return this;
    }

    public Pet addVisits(Visit visit) {
        this.visits.add(visit);
        visit.setPet(this);
        return this;
    }

    public Pet removeVisits(Visit visit) {
        this.visits.remove(visit);
        visit.setPet(null);
        return this;
    }

    public void setVisits(Set<Visit> visits) {
        if (this.visits != null) {
            this.visits.forEach(i -> i.setPet(null));
        }
        if (visits != null) {
            visits.forEach(i -> i.setPet(this));
        }
        this.visits = visits;
    }

    public PetType getType() {
        return this.type;
    }

    public Pet type(PetType petType) {
        this.setType(petType);
        return this;
    }

    public void setType(PetType petType) {
        this.type = petType;
    }

    public Owner getOwner() {
        return this.owner;
    }

    public Pet owner(Owner owner) {
        this.setOwner(owner);
        return this;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pet)) {
            return false;
        }
        return id != null && id.equals(((Pet) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pet{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", birthDate='" + getBirthDate() + "'" +
            "}";
    }
}
