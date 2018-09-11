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

describe('ProofOfDeliveryRepository', function() {

    var proofOfDeliveryRepository, ProofOfDeliveryDataBuilder, ProofOfDeliveryRepository, json,
        ProofOfDelivery, $q, $rootScope, implMock;

    beforeEach(function() {
        module('proof-of-delivery');

        inject(function($injector) {
            $q = $injector.get('$q');
            ProofOfDelivery = $injector.get('ProofOfDelivery');
            $rootScope = $injector.get('$rootScope');
            ProofOfDeliveryRepository = $injector.get('ProofOfDeliveryRepository');
            ProofOfDeliveryDataBuilder = $injector.get('ProofOfDeliveryDataBuilder');
        });

        implMock = jasmine.createSpyObj('impl', ['get', 'update']);

        proofOfDeliveryRepository = new ProofOfDeliveryRepository(implMock);
        json = new ProofOfDeliveryDataBuilder().buildJson();
    });

    describe('get', function() {

        it('should return instance of ProofOfDelivery class', function() {

            implMock.get.andReturn($q.resolve(json));

            var result;
            proofOfDeliveryRepository.get('proof-of-delivery-id')
                .then(function(proofOfDelivery) {
                    result = proofOfDelivery;
                });
            $rootScope.$apply();

            expect(result instanceof ProofOfDelivery).toBe(true);
            expect(result).toEqual(new ProofOfDelivery(json, proofOfDeliveryRepository));
            expect(implMock.get).toHaveBeenCalledWith('proof-of-delivery-id');
        });

        it('should reject if implementation rejects', function() {
            implMock.get.andReturn($q.reject());

            var rejected;
            proofOfDeliveryRepository.get('proof-of-delivery-id')
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

    });

    describe('update', function() {

        it('should resolve to updated proof of delivery', function() {
            var proofOfDelivery = new ProofOfDelivery(json, proofOfDeliveryRepository);

            implMock.update.andCallFake(function() {
                return $q.resolve(json);
            });

            var result;
            proofOfDeliveryRepository.update(proofOfDelivery)
                .then(function(proofOfDelivery) {
                    result = proofOfDelivery;
                });
            $rootScope.$apply();

            expect(result instanceof ProofOfDelivery).toBe(true);
            expect(result).toEqual(proofOfDelivery);
            expect(implMock.update).toHaveBeenCalledWith(proofOfDelivery);
        });

        it('should reject if implementation rejects', function() {
            var proofOfDelivery = new ProofOfDeliveryDataBuilder().build();
            implMock.update.andReturn($q.reject());

            var rejected;
            proofOfDeliveryRepository.update(proofOfDelivery)
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

    });

});
