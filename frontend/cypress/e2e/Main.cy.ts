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
    it('should create a new room by typing the room name and take a screenshot', () => {
      const roomName = Date.now().toString();
      cy.visit(`/`);

      // Wait until the page is displayed
      cy.findByTestId('roomName').get('input').type(roomName);
      cy.get('#joinOrCreateRoomButton').click();

      cy.title().should('contain', roomName);

      cy.get('#medalDismiss').click();

      cy.percySnapshot(`${roomName} Room`);
    });
  });

  describe('Checking connectivity', () => {
    const roomName = 'testing connectivity';
    // before(() => {
    //   cy.visit(`/room/${roomName}`);
    // });
    it('should join a room and request for puppeteer to join too and screenshot', () => {
      cy.request(
        `http://localhost:8081/connect?url=http://localhost:3000/room/${roomName}&message=freedom1&message=freedom2&kick=true`
      );
      cy.visit(`/room/${roomName}`);
      cy.percySnapshot(`${roomName} with puppeteer`);
    });
    it('nav to a room and kick nobody', () => {
      cy.visit(`/room/${roomName}`);

      // expect(
      //   cy.request(
      //     `http://localhost:8081/connect?url=http://localhost:3000/room/${roomName}&message=freedom1&message=freedom2&waitAfterSendingMessage=true`,
      //     {
      //       failOnStatusCode: false,
      //     }
      //   )
      // ).to.throw();
      // cy.get('#medalDismiss').click();

      cy.get('#message').type('SEE YA LATA ALLEGATOR >:)');
      cy.get('#messageSend').click({ force: true });
      cy.get('#toggleMic').click({ force: true });
      cy.get('#toggleCamera').click({ force: true });
      // expect(cy.get('#kickButton').click()).toThrow()

      cy.percySnapshot(`${roomName} Room`);
      cy.get('#leaveRoom').click({ force: true });
    });
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
  // it('should check connectivity with socket io server', () => {

  // })
});
