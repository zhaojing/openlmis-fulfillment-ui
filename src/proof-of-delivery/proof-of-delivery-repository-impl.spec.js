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

describe('ProofOfDeliveryRepositoryImpl', function() {

    var ProofOfDeliveryRepositoryImpl, $rootScope, $q, $httpBackend, ProofOfDeliveryDataBuilder,
        fulfillmentUrlFactory, proofOfDeliveryRepositoryImpl, proofOfDeliveryJson,
        ShipmentDataBuilder, shipmentJson, shipmentRepositoryImplMock, ShipmentLineItemDataBuilder;

    beforeEach(function() {
        module('proof-of-delivery', function($provide) {
            $provide.factory('OpenLMISRepositoryImpl', function() {
                return function() {
                    shipmentRepositoryImplMock = jasmine.createSpyObj('shipmentRepositoryImpl', [
                        'get'
                    ]);
                    return shipmentRepositoryImplMock;
                };
            });
        });

        inject(function($injector) {
            ProofOfDeliveryRepositoryImpl = $injector.get('ProofOfDeliveryRepositoryImpl');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            $httpBackend = $injector.get('$httpBackend');
            ProofOfDeliveryDataBuilder = $injector.get('ProofOfDeliveryDataBuilder');
            fulfillmentUrlFactory = $injector.get('fulfillmentUrlFactory');
            ShipmentDataBuilder = $injector.get('ShipmentDataBuilder');
            ShipmentLineItemDataBuilder = $injector.get('ShipmentLineItemDataBuilder');
        });
        proofOfDeliveryRepositoryImpl = new ProofOfDeliveryRepositoryImpl();
        proofOfDeliveryJson = new ProofOfDeliveryDataBuilder().buildJson();


        shipmentJson = new ShipmentDataBuilder()
            .withLineItems([
                ShipmentLineItemDataBuilder.buildForProofOfDeliveryLineItem(
                    proofOfDeliveryJson.lineItems[0]
                ),
                ShipmentLineItemDataBuilder.buildForProofOfDeliveryLineItem(
                    proofOfDeliveryJson.lineItems[1]
                )
            ])
            .build();
    });

    describe('get', function() {

        it('should resolve to combined server responses if requests were successful', function() {
            $httpBackend
            .expectGET(fulfillmentUrlFactory('/api/proofOfDeliveries/proof-of-delivery-id'))
            .respond(200, angular.copy(proofOfDeliveryJson));

            shipmentRepositoryImplMock.get.andReturn($q.resolve(angular.copy(shipmentJson)));

            var result;
            proofOfDeliveryRepositoryImpl.get('proof-of-delivery-id')
            .then(function(response) {
                result = response;
            })
            .catch(dump)
            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(proofOfDeliveryJson));
            expect(shipmentRepositoryImplMock.get)
                .toHaveBeenCalledWith(proofOfDeliveryJson.shipment.id);
        });

        it('should reject if shipment repository rejects', function() {
            $httpBackend
            .expectGET(fulfillmentUrlFactory('/api/proofOfDeliveries/proof-of-delivery-id'))
            .respond(200, angular.copy(proofOfDeliveryJson));

            shipmentRepositoryImplMock.get.andReturn($q.reject());

            var rejected;
            proofOfDeliveryRepositoryImpl.get('proof-of-delivery-id')
            .catch(function() {
                rejected = true;
            });
            $httpBackend.flush();

            expect(rejected).toBe(true);
            expect(shipmentRepositoryImplMock.get)
                .toHaveBeenCalledWith(proofOfDeliveryJson.shipment.id);
        });

        it('should reject if request was unsuccessful', function() {
            $httpBackend
            .expectGET(fulfillmentUrlFactory('/api/proofOfDeliveries/proof-of-delivery-id'))
            .respond(400);

            var rejected;
            proofOfDeliveryRepositoryImpl.get('proof-of-delivery-id')
            .catch(function() {
                rejected = true;
            });
            $httpBackend.flush();

            expect(rejected).toBe(true);
        });

    });

    describe('update', function() {

        it('should resolve to server response if request was successful', function() {
            $httpBackend
            .expectPUT(fulfillmentUrlFactory('/api/proofOfDeliveries/' + proofOfDeliveryJson.id), proofOfDeliveryJson)
            .respond(200, proofOfDeliveryJson);

            var result;
            proofOfDeliveryRepositoryImpl.update(proofOfDeliveryJson)
            .then(function(response) {
                result = response;
            });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(proofOfDeliveryJson));
        });

        it('should reject if request was unsuccessful', function() {
            $httpBackend
            .expectPUT(fulfillmentUrlFactory('/api/proofOfDeliveries/' + proofOfDeliveryJson.id), proofOfDeliveryJson)
            .respond(400);

            var rejected;
            proofOfDeliveryRepositoryImpl.update(proofOfDeliveryJson)
            .catch(function() {
                rejected = true;
            });
            $httpBackend.flush();

            expect(rejected).toBe(true);
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
