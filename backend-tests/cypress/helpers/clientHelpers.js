const faker=require ('faker')
const ENDPOINT_GET_CLIENTS="http://localhost:3000/api/clients"
const ENDPOINT_POST_CLIENT="http://localhost:3000/api/client/new"
const ENDPOINT_GET_CLIENT="http://localhost:3000/api/client/"

function createRandomClientPayload(){
    const fakeName=faker.name.findName()
    const fakeEmail=faker.internet.email()
    const fakePhone=faker.phone.phoneNumber()

    const payload={"name":fakeName,
                    "email":fakeEmail,
                    "telephone":fakePhone
                }
                return payload
}


function getRequestAllClientsWithAssertion(cy, name, email, telephone){
    cy.request({method:"GET",
    url:ENDPOINT_GET_CLIENTS,
    headers:{'X-User-Auth':JSON.stringify(Cypress.env().loginToken), 
            'content-Type':'application/json'},

    }).then ((response => {
        const responseAsString=JSON.stringify(response)
        expect (responseAsString).to.have.string(name)
        expect (responseAsString).to.have.string(email)
        expect (responseAsString).to.have.string(telephone)
    }))
}


function getAllClientsAssertDeleted(cy, lastId){
    cy.request({method:"GET",
    url:ENDPOINT_GET_CLIENTS,
    headers:{'X-User-Auth':JSON.stringify(Cypress.env().loginToken), 
            'content-Type':'application/json'},
    }).then ((response => {
        const responseAsString=JSON.stringify(response)
        let newLastId=response.body[response.body.length -1].id
        cy.log(newLastId)
        expect (newLastId).not.to.eq(lastId)
    }))
}


function deleteRequestAfterGet(cy){
    cy.request({method:"GET",
    url:ENDPOINT_GET_CLIENTS,
    headers:{'X-User-Auth':JSON.stringify(Cypress.env().loginToken), 
            'content-Type':'application/json'},

    }).then ((response => {
        const responseAsString=JSON.stringify(response)
        let lastId = response.body[response.body.length -1].id

        cy.request({
            method:'DELETE',
            url:ENDPOINT_GET_CLIENT+lastId,
            headers:{'X-User-Auth':JSON.stringify(Cypress.env().loginToken), 
            'content-Type':'application/json'},
        }).then ((response => {
            const responseAsString=JSON.stringify(response.body)
            cy.log(responseAsString)
            expect(responseAsString).to.have.string('true')    
        }))
        getAllClientsAssertDeleted(cy, lastId)
    }))
}



function createClientRequest(cy){
    cy.authenticateSession().then((response => {
        let fakeClientPayload= createRandomClientPayload()

        cy.request({method:"POST",
                    url:ENDPOINT_POST_CLIENT,
                    headers:{'X-User-Auth':JSON.stringify(Cypress.env().loginToken), 
                            'Content-Type':'application/json'},
                    body: fakeClientPayload

    }).then ((response => {
        const responseAsString=JSON.stringify(response)
        expect (responseAsString).to.have.string(fakeClientPayload.name)
    }))
    getRequestAllClientsWithAssertion(cy, fakeClientPayload.name, fakeClientPayload.email, fakeClientPayload.telephone)
}))
}


function createClientAndDelete(cy){
    cy.authenticateSession().then((response => {
        let fakeClientPayload= createRandomClientPayload()

        cy.request({method:"POST",
                    url:ENDPOINT_POST_CLIENT,
                    headers:{'X-User-Auth':JSON.stringify(Cypress.env().loginToken), 
                            'Content-Type':'application/json'},
                    body: fakeClientPayload

    }).then ((response => {
        const responseAsString=JSON.stringify(response)
        expect (responseAsString).to.have.string(fakeClientPayload.name)
    }))
    deleteRequestAfterGet(cy)
}))
}



module.exports={
    createClientRequest,
    createClientAndDelete
}