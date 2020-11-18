/// <reference types="cypress" />

import * as clientHelpers from '../helpers/clientHelpers'
import * as roomHelpers from '../helpers/roomHelpers'

describe ('testing auth', function(){

    it('Create new client', function(){
        clientHelpers.createClientRequest(cy)
    })

    it('Create client and delete', function(){
        clientHelpers.createClientAndDelete(cy)
    })


    it('Create new room', function(){
        roomHelpers.createRoomRequest(cy)
    })

    it('Create room and change', function(){
        roomHelpers.createRoomAndChange(cy)
    })
})