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

describe('proofOfDeliveryLegacyService', function() {

    var proofOfDeliveryLegacyService, $httpBackend, fulfillmentUrlFactory, ProofOfDeliveryDataBuilder;

    beforeEach(function() {
        module('proof-of-delivery');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            fulfillmentUrlFactory = $injector.get('fulfillmentUrlFactory');
            proofOfDeliveryLegacyService = $injector.get('proofOfDeliveryLegacyService');
            ProofOfDeliveryDataBuilder = $injector.get('ProofOfDeliveryDataBuilder');
        });
    });

    describe('getByOrderId', function() {

        it('should return transformed proof of deliveries', function() {
            var json = new ProofOfDeliveryDataBuilder().buildJson();

            $httpBackend
            .whenGET(fulfillmentUrlFactory('/api/orders/id-one/proofOfDeliveries'))
            .respond(200, json);

            var result;
            proofOfDeliveryLegacyService.getByOrderId('id-one')
            .then(function(response) {
                result = response;
            });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(json));
        });

        it('should reject if request fails', function() {
            $httpBackend
            .whenGET(fulfillmentUrlFactory('/api/orders/order-id/proofOfDeliveries'))
            .respond(400);

            var rejected;
            proofOfDeliveryLegacyService.getByOrderId('order-id')
            .catch(function() {
                rejected = true;
            });
            $httpBackend.flush();

            expect(rejected).toEqual(true);
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
