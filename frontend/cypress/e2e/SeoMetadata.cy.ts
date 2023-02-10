describe('Seo metadata', () => {
  describe('Verify SEO Metadata', () => {
    it('should render SEO metadata on Index page', () => {
      cy.visit('/');

      // The Index page should have a page title
      cy.title().should('not.be.empty');

      // The Index page should also contain a meta description for SEO
      cy.get('head meta[name="description"]')
        .invoke('attr', 'content')
        .should('not.be.empty');
    });
    it('should render SEO metadata on a room', () => {
      const roomName = 'testing seo';
      cy.visit(`/room/${roomName}`);

      // The room testing seo page should have a page title
      cy.title().should('contain', roomName);

      // The Index page should also contain a meta description for SEO
      cy.get('head meta[name="description"]')
        .invoke('attr', 'content')
        .should('not.be.empty');
    });
  });
});
