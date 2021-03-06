package tech.dimitar.jhipster.petclinic.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Visit.
 */
@Entity
@Table(name = "visits")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Visit implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "visit_date")
    private LocalDate visitDate;

    @NotNull
    @Size(max = 255)
    @Column(name = "description", length = 255, nullable = false)
    private String description;

    @ManyToOne
    @JsonIgnoreProperties(value = { "visits", "type", "owner" }, allowSetters = true)
    private Pet pet;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Visit id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getVisitDate() {
        return this.visitDate;
    }

    public Visit visitDate(LocalDate visitDate) {
        this.visitDate = visitDate;
        return this;
    }

    public void setVisitDate(LocalDate visitDate) {
        this.visitDate = visitDate;
    }

    public String getDescription() {
        return this.description;
    }

    public Visit description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Pet getPet() {
        return this.pet;
    }

    public Visit pet(Pet pet) {
        this.setPet(pet);
        return this;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Visit)) {
            return false;
        }
        return id != null && id.equals(((Visit) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Visit{" +
            "id=" + getId() +
            ", visitDate='" + getVisitDate() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
