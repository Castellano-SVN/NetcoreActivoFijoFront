describe('Go to almacenes', () => {
  beforeEach(() => {
    const user = Cypress.env('user');
    cy.visit(`/?remotetoken=${user}`);

    cy.contains('Prestadores').should('exist').and('be.visible').click();

    cy.get('[id^="centro centro-"]').then(($items) => {
      expect($items.length, 'Número de centros encontrados').to.be.greaterThan(0)
    })
    cy.get('#centro\\ centro-0 button').first().click()
    cy.get('#showAlmacen\\ showAlmacen-0').click()
    cy.url().should('include', '/centrocosto')
    cy.contains('01').click()

    cy.get('table',).first()            // obtiene la primera tabla
      .find('tbody tr').first()         // toma la primera fila del cuerpo
      .find('td').eq(4)
      .click()
    cy.url().should('include', '/centrocosto/almacen')
    cy.wait(3000)
  })
  it('Mover totalidad a una locacion random', () => {

    const tablasVacias: any[] = []
    const tablaNoVacia: any[] = []
    cy.get('[id^="location"]').each(($loc, index) => {
      cy.wrap($loc).within(() => {
        cy.get('table').then(($table) => {
          const rowCount = $table.find('tbody > tr').length

          if (rowCount === 0) {
            cy.log(`🚨 Tabla vacía en locación #${index}`)
            tablasVacias.push(index) // guardamos el índice
          } else {
            tablaNoVacia.push(index)
            cy.log(`✅ Tabla en locación #${index} tiene ${rowCount} filas`)
          }
        })
      })
    }).then(() => {
      cy.log(`📋 Tablas vacías: ${tablasVacias.join(', ')}`)
      if (tablaNoVacia.length > 0) {
        const indice = tablaNoVacia[0]
        cy.log(`🖱️ Haciendo click en la locación vacía #${indice}`)
        cy.get('[id^="location"]').eq(indice).within(() => {
          cy.get('table tbody tr').each(($fila, filaIndex) => {
            const cantidad = cy.wrap($fila).find('td').eq(1);
            const estado = cy.wrap($fila).find('td').eq(2);
            cy.wrap($fila).find('td').eq(3).click();
  cy.get('.modal', { timeout: 10000 }).should('exist')

          })
        })

      }
    })


  });
});

