/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

describe('ShipmentRepositoryImpl', function() {

    var shipmentRepositoryImpl, ShipmentRepositoryImpl, $rootScope, $httpBackend,
        ShipmentDataBuilder, shipmentJson, fulfillmentUrlFactory;

    beforeEach(function() {
        module('shipment');

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $httpBackend = $injector.get('$httpBackend');
            fulfillmentUrlFactory = $injector.get('fulfillmentUrlFactory');
            ShipmentRepositoryImpl = $injector.get('ShipmentRepositoryImpl');
            ShipmentDataBuilder = $injector.get('ShipmentDataBuilder');
        });

        shipmentRepositoryImpl = new ShipmentRepositoryImpl();
        shipmentJson = new ShipmentDataBuilder().build();
    });

    describe('get', function() {

        it('should resolve to server response on successful request', function() {
            $httpBackend
            .expectGET(fulfillmentUrlFactory('/api/shipments/' + shipmentJson.id))
            .respond(200, shipmentJson);

            var result;
            shipmentRepositoryImpl.get(shipmentJson.id)
            .then(function(shipmentJson) {
                result = shipmentJson;
            });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(shipmentJson));
        });

        it('should reject on failed request', function() {
            $httpBackend
            .expectGET(fulfillmentUrlFactory('/api/shipments/' + shipmentJson.id))
            .respond(400);

            var rejected;
            shipmentRepositoryImpl.get(shipmentJson.id)
            .catch(function() {
                rejected = true;
            });
            $httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should reject if null was given', function() {
            var rejected;
            shipmentRepositoryImpl.get()
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
