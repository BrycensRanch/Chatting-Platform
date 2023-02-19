/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-underscore-dangle */
// TODO: figure out how to optionally deny webcam permissions for testing purposes

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
    it('should test nav buttons', () => {
      cy.visit('/');
      // Wait until the page is displayed
      cy.get('#home').click({ force: true });
      cy.url().should('equal', 'http://localhost:3000/');
      cy.percySnapshot('Homepage');
    });
    it('should create a new room by typing the room name and take a screenshot', () => {
      const roomName = Date.now().toString();
      cy.visit(`/`);

      // Wait until the page is displayed
      cy.findByTestId('roomName').get('input').type(roomName, { force: true });
      cy.get('#joinOrCreateRoomButton').click({ force: true });

      cy.title().should('contain', roomName);

      // we are expecting that we are the room host, hence, we get a modal dialog
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(cy.get('#medalDismiss')).to.exist;

      cy.percySnapshot(`${roomName} Room`);
    });
  });

  describe('Checking connectivity', () => {
    const roomName = 'testingconnectivity';
    // before(() => {
    //   cy.visit(`/room/${roomName}`);
    // });
    it('should join a room and request for puppeteer to join too and screenshot', () => {
      cy.request(
        `http://localhost:8081/connect?url=http://localhost:3000/room/${roomName}&message=freedom1&message=freedom2&kick=true`
      );
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.visit(`/room/${roomName}`);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(2000);
      cy.title().should('not.contain', roomName);
      // cy.get('#message').type('WASSUP G', { force: true });
      // cy.get('#messageSend').click({ force: true });
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
      cy.request(
        `http://localhost:8081/connect?url=http://localhost:3000/room/${roomName}&waitAfterSendingMessage=true`
      );
      cy.get('#message').type('SEE YA LATA ALLEGATOR >:)', { force: true });
      cy.get('#messageSend').click({ force: true });
      cy.get('#message').should('be.empty');
      cy.get('#toggleMic').click({ force: true });
      cy.get('#toggleMic').should('contain', 'UnMute');
      cy.get('#toggleCamera').click({ force: true });
      cy.get('#toggleCamera').should('contain', 'Start');

      cy.percySnapshot(`${roomName} Room`);
      cy.get('#leaveRoom').click({ force: true });
      cy.reload();
      cy.request(
        `http://localhost:8081/connect?url=http://localhost:3000/room/${roomName}&waitAfterSendingMessage=true`
      );
      cy.visit('/');
      cy.request(
        `http://localhost:8081/connect?url=http://localhost:3000/room/${roomName}&waitAfterSendingMessage=true`
      );
      cy.get(`#room-${roomName}`).click({ force: true });
      cy.title().should('contain', roomName);
      cy.get('#youJoinedNotCreated').should('contain', 'joined');
      const roomsThatPuppeteerWillLeave = [
        'sons of github',
        'sons of githubv2',
      ];
      cy.visit(`/room/${roomsThatPuppeteerWillLeave[0]}`);
      cy.request(
        `http://localhost:8081/connect?url=http://localhost:3000/room/${roomsThatPuppeteerWillLeave[0]}&waitAfterSendingMessage=true`
      );
      cy.get('#kickButton').click({ force: true });
      cy.visit(`/room/${roomsThatPuppeteerWillLeave[1]}`);
      cy.request(
        `http://localhost:8081/connect?url=http://localhost:3000/room/${roomsThatPuppeteerWillLeave[1]}&waitAfterSendingMessage=true&leave=true`
      );
      cy.get('#peerVideo')
        .invoke('attr', 'data-connected')
        .then((connected) => {
          expect(connected).to.equal('true');
        });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);
      cy.get('#kickButton').click({ force: true }); // just in-case
      cy.get('#messageSend').click({ force: true });
      cy.visit('/room/connect_error');
      cy.get('#peerVideo')
        .invoke('attr', 'data-connected')
        .then((connected) => {
          expect(connected).to.equal('false');
        }); //
      cy.visit('/room/kickout_event');
    });
    it('should create a new room by DIRECTLY visiting a url and take a screenshot', () => {
      const roomName = 'testing';
      cy.visit(`/room/${roomName}`);

      // Wait until the page is displayed
      cy.get('#medalDismiss').click({ force: true });

      cy.percySnapshot('Testing Room');
    });
    it('should try to join a full room', () => {
      const roomName = 'full room';
      cy.request(
        `http://localhost:8081/connect?url=http://localhost:3000/room/${roomName}&message=freedom1&message=freedom2&waitAfterSendingMessage=true`
      );
      // backend code emits 'full' when it detects Cypress and the name 'full room', regardless whether or not the room is full for testing purposes
      cy.visit(`/room/${roomName}`);
      // we should now be on the homepage with medal
      cy.get('#medalDismiss').click();

      cy.percySnapshot(roomName);
    });
    it('should try to join the connect_error room', () => {
      const roomName = 'connect_error';
      // backend code emits 'full' when it detects Cypress and the name 'full room', regardless whether or not the room is full for testing purposes
      cy.visit(`/room/${roomName}`);
      // we should now be on the homepage with medal
      cy.percySnapshot(`${roomName} Room`);
    });
    it('should try to join the kickout_event room', () => {
      const roomName = 'kickout_event';
      cy.request(
        `http://localhost:8081/connect?url=http://localhost:3000/room/${roomName}&message=freedom1&message=freedom2&waitAfterSendingMessage=true`
      );
      // backend code emits 'full' when it detects Cypress and the name 'full room', regardless whether or not the room is full for testing purposes
      cy.visit(`/room/${roomName}`);
      // we should now be on the homepage with medal
      cy.percySnapshot(`${roomName} Room`);
    });
    // it('should check connectivity with socket io server', () => {

    // })
  });
});
