const faker =require('faker')
const ENDPOINT_POST_ROOM='http://localhost:3000/api/room/new'
const ENDPOINT_GET_ROOMS='http://localhost:3000/api/rooms'
const ENDPOINT_GET_ROOM='http://localhost:3000/api/room/'

function createRandomRoomPayload(){
    const fakeRoomNr=faker.random.number({min:1, max:100})
    const fakeFloor=faker.random.number({min:1, max:10})
    const fakePrice=faker.finance.amount(500, 5000, 0)
    const fakeFeature=faker.helpers.randomize([["balcony"], ["ensuite"], ["sea view"], ["penthouse"]])
    const fakeCategory=faker.helpers.randomize(["double", "single", "twin"])
    const fakeAvailable=faker.random.boolean()

    const payload={"features":fakeFeature,
                    "category":fakeCategory,
                    "number":fakeRoomNr,
                    "floor":fakeFloor,
                    "available":fakeAvailable,
                    "price":fakePrice
                }
                return payload
}


function getRequestAllRoomsWithAssertion(cy, category, number, floor, features, available, price){
    cy.request({method:"GET",
    url:ENDPOINT_GET_ROOMS,
    headers:{'X-User-Auth':JSON.stringify(Cypress.env().loginToken), 
            'content-Type':'application/json'},

}).then ((response => {
        const responseAsString=JSON.stringify(response)
        expect (responseAsString).to.have.string(category)
        expect (responseAsString).to.have.string(number)
        expect (responseAsString).to.have.string(floor)
        expect (responseAsString).to.have.string(features)
        expect (responseAsString).to.have.string(available)
        expect (responseAsString).to.have.string(price)
    }))
}


function createRoomRequest(cy){
    cy.authenticateSession().then((response => {
        let fakeRoomPayload= createRandomRoomPayload()

        cy.request({method:"POST",
                    url:ENDPOINT_POST_ROOM,
                    headers:{'X-User-Auth':JSON.stringify(Cypress.env().loginToken), 
                            'Content-Type':'application/json'},
                    body: fakeRoomPayload

    }).then ((response => {
       
        const responseAsString=JSON.stringify(response)
        cy.log(responseAsString)
        expect (responseAsString).to.have.string(fakeRoomPayload.category)
    }))
  getRequestAllRoomsWithAssertion(cy, fakeRoomPayload.category, fakeRoomPayload.number, fakeRoomPayload.floor, fakeRoomPayload.features, 
  fakeRoomPayload.available, fakeRoomPayload.price)
}))
}


 function putRequestAfterGet(cy){
     cy.request({method:"GET",
     url:ENDPOINT_GET_ROOMS,
     headers:{'X-User-Auth':JSON.stringify(Cypress.env().loginToken), 
             'content-Type':'application/json'},
 
 }).then ((response => {
         const responseAsString=JSON.stringify(response)
         let lastId = response.body[response.body.length -1].id
         //cy.log(lastId)
         
         let id = response.body[response.body.length -1].id
         let created= response.body[response.body.length -1].created
         let cat = response.body[response.body.length -1].category
         let nr =response.body[response.body.length -1].number
         let floor = response.body[response.body.length -1].floor
         let features=response.body[response.body.length -1].features
         let fakeAvailable=faker.helpers.randomize([true, false])
         let fakePrice=faker.finance.amount(500, 5000, 0)
 
         let payload={
            "id":id,
            "created":created,
            "features":features,
            "category":cat,
            "number":nr,
            "floor":floor,
            "available":fakeAvailable,
            "price":fakePrice
        
         }
 
         cy.request({
             method:'PUT',
             url:ENDPOINT_GET_ROOM+lastId,
             headers:{'X-User-Auth':JSON.stringify(Cypress.env().loginToken), 
             'content-Type':'application/json'},
             body: payload
         }).then ((response => {
             const responseAsString=JSON.stringify(response.body)
             cy.log(responseAsString)
            expect(responseAsString).to.have.string(payload.price)
     
         }))
    }))
 
}


function createRoomAndChange(cy){
    cy.authenticateSession().then((response => {
        let fakeRoomPayload= createRandomRoomPayload()
 
       cy.request({method:"POST",
                    url:ENDPOINT_POST_ROOM,
                    headers:{'X-User-Auth':JSON.stringify(Cypress.env().loginToken), 
                          'Content-Type':'application/json'},
                    body: fakeRoomPayload
 
     }).then ((response => {
        cy.log(JSON.stringify(response))
         const responseAsString=JSON.stringify(response)
         cy.log(responseAsString)
     }))
     putRequestAfterGet(cy)
 }))
}


module.exports={
createRoomRequest,
createRoomAndChange
}