describe('vendor update test', () => {
  it('visits the vendor page and updates an vendor', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'vendors').click();
    cy.contains('Nick').click(); // replace Slick with your own name
    cy.get("[formControlName='email']").clear();
    cy.get("[formControlName='email']").type('someemail@domain.com');
    cy.get('form').submit();
    cy.contains('updated!');
  });
});
