package tech.dimitar.jhipster.petclinic;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("tech.dimitar.jhipster.petclinic");

        noClasses()
            .that()
            .resideInAnyPackage("tech.dimitar.jhipster.petclinic.service..")
            .or()
            .resideInAnyPackage("tech.dimitar.jhipster.petclinic.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..tech.dimitar.jhipster.petclinic.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
