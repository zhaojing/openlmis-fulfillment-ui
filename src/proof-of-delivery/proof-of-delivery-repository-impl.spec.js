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
        fulfillmentUrlFactory, referencedataUrlFactory, proofOfDeliveryRepositoryImpl, proofOfDeliveryJson,
        ShipmentDataBuilder, shipmentJson, ShipmentLineItemDataBuilder,
        lotRepositoryImplMock, LotDataBuilder, lotJsons, PageDataBuilder;

    beforeEach(function() {
        module('proof-of-delivery', function($provide) {
            $provide.factory('OpenLMISRepositoryImpl', function() {
                return function(url) {
                    if (url === referencedataUrlFactory('/api/lots')) {
                        lotRepositoryImplMock = jasmine.createSpyObj(
                            'lotRepositoryImpl', ['query']
                        );
                        return lotRepositoryImplMock;
                    }
                };
            });
        });

        inject(function($injector) {
            referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            fulfillmentUrlFactory = $injector.get('fulfillmentUrlFactory');
            ProofOfDeliveryRepositoryImpl = $injector.get('ProofOfDeliveryRepositoryImpl');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            $httpBackend = $injector.get('$httpBackend');
            ProofOfDeliveryDataBuilder = $injector.get('ProofOfDeliveryDataBuilder');
            ShipmentDataBuilder = $injector.get('ShipmentDataBuilder');
            ShipmentLineItemDataBuilder = $injector.get('ShipmentLineItemDataBuilder');
            LotDataBuilder = $injector.get('LotDataBuilder');
            PageDataBuilder = $injector.get('PageDataBuilder');
        });

        proofOfDeliveryRepositoryImpl = new ProofOfDeliveryRepositoryImpl();
        proofOfDeliveryJson = new ProofOfDeliveryDataBuilder().buildJson();

        lotJsons = [
            new LotDataBuilder()
                .withId(proofOfDeliveryJson.lineItems[0].lot.id)
                .build(),
            new LotDataBuilder()
                .withId(proofOfDeliveryJson.lineItems[1].lot.id)
                .build()
        ];

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

        proofOfDeliveryJson.shipment = shipmentJson;
    });

    describe('get', function() {

        it('should resolve to combined server responses if requests were successful', function() {
            $httpBackend
            .expectGET(fulfillmentUrlFactory('/api/proofsOfDelivery/proof-of-delivery-id?expand=shipment.order'))
            .respond(200, angular.copy(proofOfDeliveryJson));

            lotRepositoryImplMock.query.andReturn($q.resolve(new PageDataBuilder()
                .withContent(lotJsons)
                .build()
            ));

            var result;
            proofOfDeliveryRepositoryImpl.get('proof-of-delivery-id')
            .then(function(response) {
                result = response;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.id).toEqual(proofOfDeliveryJson.id);
            expect(result.status).toEqual(proofOfDeliveryJson.status);
            expect(result.deliveredBy).toEqual(proofOfDeliveryJson.deliveredBy);
            expect(result.receivedBy).toEqual(proofOfDeliveryJson.receivedBy);
            expect(result.receivedDate).toEqual(proofOfDeliveryJson.receivedDate);
            expect(result.shipment).toEqual(shipmentJson);

            var lineItem = result.lineItems[0],
                expected = proofOfDeliveryJson.lineItems[0];

            expect(lineItem.id).toEqual(expected.id);
            expect(lineItem.orderable).toEqual(expected.orderable);
            expect(lineItem.lot).toEqual(lotJsons[0]);
            expect(lineItem.quantityAccepted).toEqual(expected.quantityAccepted);
            expect(lineItem.quantityRejected).toEqual(expected.quantityRejected);
            expect(lineItem.quantityShipped).toEqual(shipmentJson.lineItems[0].quantityShipped);

            lineItem = result.lineItems[1];
            expected = proofOfDeliveryJson.lineItems[1];
            expect(lineItem.id).toEqual(expected.id);
            expect(lineItem.orderable).toEqual(expected.orderable);
            expect(lineItem.lot).toEqual(lotJsons[1]);
            expect(lineItem.quantityAccepted).toEqual(expected.quantityAccepted);
            expect(lineItem.quantityRejected).toEqual(expected.quantityRejected);
            expect(lineItem.quantityShipped).toEqual(shipmentJson.lineItems[1].quantityShipped);

        });

        it('should reject if request was unsuccessful', function() {
            $httpBackend
            .expectGET(fulfillmentUrlFactory('/api/proofsOfDelivery/proof-of-delivery-id?expand=shipment.order'))
            .respond(400);

            var rejected;
            proofOfDeliveryRepositoryImpl.get('proof-of-delivery-id')
            .catch(function() {
                rejected = true;
            });
            $httpBackend.flush();

            expect(rejected).toBe(true);
        });

        it('should reject if lot repository rejectes', function() {
            $httpBackend
            .expectGET(fulfillmentUrlFactory('/api/proofsOfDelivery/proof-of-delivery-id?expand=shipment.order'))
            .respond(200, angular.copy(proofOfDeliveryJson));

            lotRepositoryImplMock.query.andReturn($q.reject());

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
            .expectPUT(fulfillmentUrlFactory('/api/proofsOfDelivery/' + proofOfDeliveryJson.id), proofOfDeliveryJson)
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
            .expectPUT(fulfillmentUrlFactory('/api/proofsOfDelivery/' + proofOfDeliveryJson.id), proofOfDeliveryJson)
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
