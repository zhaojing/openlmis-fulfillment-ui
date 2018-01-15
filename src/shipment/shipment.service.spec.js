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

describe('shipmentService', function() {

    var SHIPMENT_ENDPOINT = '/api/shipments';

    var shipmentService, $httpBackend, fulfillmentUrlFactory, $rootScope, ShipmentDataBuilder;

    beforeEach(function() {
        module('openlmis-pagination');
        module('shipment');

        inject(function($injector) {
            shipmentService = $injector.get('shipmentService');
            $httpBackend = $injector.get('$httpBackend');
            fulfillmentUrlFactory = $injector.get('fulfillmentUrlFactory');
            $rootScope = $injector.get('$rootScope');
            ShipmentDataBuilder = $injector.get('ShipmentDataBuilder');
        });
    });

    describe('create', function() {

        var shipment;

        beforeEach(function() {
            shipment = new ShipmentDataBuilder().build();
        });

        it('should resolve if successfully created', function() {
            shipment = new ShipmentDataBuilder().buildWithoutId();
            $httpBackend
            .expectPOST(fulfillmentUrlFactory(SHIPMENT_ENDPOINT), shipment)
            .respond(200, shipment);

            var result;
            shipmentService.create(shipment)
            .then(function(response) {
                result = response;
            });
            $rootScope.$apply();
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(shipment));
        });

        it('should resolve if successfully updated', function() {
            $httpBackend
            .expectPOST(fulfillmentUrlFactory(SHIPMENT_ENDPOINT), shipment)
            .respond(200, shipment);

            var result;
            shipmentService.create(shipment)
            .then(function(response) {
                result = response;
            });
            $rootScope.$apply();
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(shipment));
        });

        it('should reject if failed to save shipment', function() {
            $httpBackend
            .expectPOST(fulfillmentUrlFactory(SHIPMENT_ENDPOINT), shipment)
            .respond(404);

            var rejected;
            shipmentService.create(shipment)
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();
            $httpBackend.flush();

            expect(rejected).toBe(true);
        });

        it('should throw exception if shipment is not given', function() {
            expect(function() {
                shipmentService.create();
            }).toThrow('Shipment must be defined');
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
