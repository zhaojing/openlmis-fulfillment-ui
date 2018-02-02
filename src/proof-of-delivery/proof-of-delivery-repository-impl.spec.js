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
        fulfillmentUrlFactory, proofOfDeliveryRepositoryImpl, json;

    beforeEach(function() {
        module('proof-of-delivery');

        inject(function($injector) {
            ProofOfDeliveryRepositoryImpl = $injector.get('ProofOfDeliveryRepositoryImpl');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            $httpBackend = $injector.get('$httpBackend');
            ProofOfDeliveryDataBuilder = $injector.get('ProofOfDeliveryDataBuilder');
            fulfillmentUrlFactory = $injector.get('fulfillmentUrlFactory');
        });

        proofOfDeliveryRepositoryImpl = new ProofOfDeliveryRepositoryImpl();
        json = new ProofOfDeliveryDataBuilder().buildJson();
    });

    describe('get', function() {

        it('should resolve to server response if request was successful', function() {
            $httpBackend
            .expectGET(fulfillmentUrlFactory('/api/proofOfDeliveries/proof-of-delivery-id'))
            .respond(200, json);

            var result;
            proofOfDeliveryRepositoryImpl.get('proof-of-delivery-id')
            .then(function(response) {
                result = response;
            });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(json));
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
            .expectPUT(fulfillmentUrlFactory('/api/proofOfDeliveries/' + json.id), json)
            .respond(200, json);

            var result;
            proofOfDeliveryRepositoryImpl.update(json)
            .then(function(response) {
                result = response;
            });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(json));
        });

        it('should reject if request was unsuccessful', function() {
            $httpBackend
            .expectPUT(fulfillmentUrlFactory('/api/proofOfDeliveries/' + json.id), json)
            .respond(400);

            var rejected;
            proofOfDeliveryRepositoryImpl.update(json)
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
