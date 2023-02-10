/* eslint-disable no-underscore-dangle */
describe('Navigation', () => {
  describe('Static pages', () => {
    it('should take screenshot of the homepage', () => {
      cy.visit('/');

      // Wait until the page is displayed
      cy.findByRole('heading', {
        name: 'Rooms:',
      });

      cy.percySnapshot('Homepage');
    });
    it('should log coverage', () => {
      console.log(global.__coverage__);
    });
    it('should create a new room by DIRECTLY visiting a url and take a screenshot', () => {
      const roomName = 'testing';
      cy.visit(`/room/${roomName}`);

      // Wait until the page is displayed
      cy.findByRole('heading', {
        name: `Room name: ${roomName}`,
      });

      cy.percySnapshot('Testing Room');
    });
  });
  describe('Checking connectivity', () => {
    const roomName = 'testing connectivity';
    before(() => {
      cy.visit(`/room/${roomName}`);
    });
    it('should join a room and request for puppeteer to join too and screenshot', () => {
      cy.request(
        `http://localhost:8081/connect?url=http://localhost:3000/room/${roomName}&message=freedom1&message=freedom2`
      );
      cy.percySnapshot(`${roomName} with puppeteer`);
    });

    // it('should check connectivity with socket io server', () => {

    // })
  });
});
