describe('vendor add test', () => {
  it('visits the vendor page and adds an vendor', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'vendors').click();
    cy.contains('control_point').click();

    //contents
    //Name
    cy.get('input[formcontrolname=name')
      .click({ force: true })
      .type('Nick Goudsbloem');

    //Email
    cy.get('input[formcontrolname=email')
      .click({ force: true })
      .type('ws@shacl.com');

    //Phone
    cy.get('input[formcontrolname=phone')
      .click({ force: true })
      .type('(555)555-5555');

    //Address
    cy.get('input[formcontrolname=address1')
      .click({ force: true })
      .type('123 Pine');

    //City
    cy.get('input[formcontrolname=city').click({ force: true }).type('London');

    //Province
    cy.get('mat-select[formcontrolname=province')
      .click()
      .get('mat-option')
      .contains('Ontario')
      .click();

    //Postal code
    cy.get('input[formcontrolname=postalcode')
      .click({ force: true })
      .type('N1N-1N1');

    //Vendor rating
    //N/A

    cy.get('button').contains('Save').click();
    cy.contains('added!');
  });
});
