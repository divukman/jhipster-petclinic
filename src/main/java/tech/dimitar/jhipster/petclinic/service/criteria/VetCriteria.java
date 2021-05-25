package tech.dimitar.jhipster.petclinic.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.BooleanFilter;
import tech.jhipster.service.filter.DoubleFilter;
import tech.jhipster.service.filter.Filter;
import tech.jhipster.service.filter.FloatFilter;
import tech.jhipster.service.filter.IntegerFilter;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.StringFilter;

/**
 * Criteria class for the {@link tech.dimitar.jhipster.petclinic.domain.Vet} entity. This class is used
 * in {@link tech.dimitar.jhipster.petclinic.web.rest.VetResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /vets?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class VetCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter firstName;

    private StringFilter lastName;

    private LongFilter specialtiesId;

    public VetCriteria() {}

    public VetCriteria(VetCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.firstName = other.firstName == null ? null : other.firstName.copy();
        this.lastName = other.lastName == null ? null : other.lastName.copy();
        this.specialtiesId = other.specialtiesId == null ? null : other.specialtiesId.copy();
    }

    @Override
    public VetCriteria copy() {
        return new VetCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public LongFilter id() {
        if (id == null) {
            id = new LongFilter();
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getFirstName() {
        return firstName;
    }

    public StringFilter firstName() {
        if (firstName == null) {
            firstName = new StringFilter();
        }
        return firstName;
    }

    public void setFirstName(StringFilter firstName) {
        this.firstName = firstName;
    }

    public StringFilter getLastName() {
        return lastName;
    }

    public StringFilter lastName() {
        if (lastName == null) {
            lastName = new StringFilter();
        }
        return lastName;
    }

    public void setLastName(StringFilter lastName) {
        this.lastName = lastName;
    }

    public LongFilter getSpecialtiesId() {
        return specialtiesId;
    }

    public LongFilter specialtiesId() {
        if (specialtiesId == null) {
            specialtiesId = new LongFilter();
        }
        return specialtiesId;
    }

    public void setSpecialtiesId(LongFilter specialtiesId) {
        this.specialtiesId = specialtiesId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final VetCriteria that = (VetCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(firstName, that.firstName) &&
            Objects.equals(lastName, that.lastName) &&
            Objects.equals(specialtiesId, that.specialtiesId)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, firstName, lastName, specialtiesId);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VetCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (firstName != null ? "firstName=" + firstName + ", " : "") +
            (lastName != null ? "lastName=" + lastName + ", " : "") +
            (specialtiesId != null ? "specialtiesId=" + specialtiesId + ", " : "") +
            "}";
    }
}
