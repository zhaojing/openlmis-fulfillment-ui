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

describe('ProofOfDelivery', function() {

    var ProofOfDelivery, ProofOfDeliveryLineItem, ProofOfDeliveryDataBuilder, $q, $rootScope, json;

    beforeEach(function() {
        module('proof-of-delivery');

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            ProofOfDelivery = $injector.get('ProofOfDelivery');
            ProofOfDeliveryLineItem = $injector.get('ProofOfDeliveryLineItem');
            ProofOfDeliveryDataBuilder = $injector.get('ProofOfDeliveryDataBuilder');
        });

        json = new ProofOfDeliveryDataBuilder().buildJson();
    });

    describe('constructor', function() {

        it('should copy properties from JSON', function() {
            var result = new ProofOfDelivery(json);

            expect(result.id).toEqual(json.id);
            expect(result.order).toEqual(json.order);
            expect(result.deliveredBy).toEqual(json.deliveredBy);
            expect(result.receivedBy).toEqual(json.receivedBy);
        });

        it('should create line items', function() {
            var result = new ProofOfDelivery(json);

            expect(result.lineItems[0] instanceof ProofOfDeliveryLineItem).toBe(true);
            expect(result.lineItems[1] instanceof ProofOfDeliveryLineItem).toBe(true);
            expect(result.lineItems).toEqual([
                new ProofOfDeliveryLineItem(json.lineItems[0]),
                new ProofOfDeliveryLineItem(json.lineItems[1])
            ]);
        });
    });

    describe('save', function() {

        var proofOfDelivery, proofOfDeliveryRepositoryMock;

        beforeEach(function() {
            proofOfDeliveryRepositoryMock = jasmine.createSpyObj('repository', ['update']);
            proofOfDelivery = new ProofOfDelivery(json, proofOfDeliveryRepositoryMock);
        });

        it('should resolve when saved', function() {
            proofOfDeliveryRepositoryMock.update.andReturn($q.resolve());

            var saved;
            proofOfDelivery.save()
            .then(function() {
                saved = true;
            });
            $rootScope.$apply();

            expect(saved).toBe(true);
        });

        it('should reject if save failed', function() {
            proofOfDeliveryRepositoryMock.update.andReturn($q.reject());

            var saved;
            proofOfDelivery.save()
            .catch(function() {
                saved = false;
            });
            $rootScope.$apply();

            expect(saved).toBe(false);
        });

    });

    describe('validate', function() {

        var proofOfDelivery;

        beforeEach(function() {
            proofOfDelivery = new ProofOfDelivery(json);
        });

        it('should return undefined if Proof of Delivery is valid', function() {
            expect(proofOfDelivery.validate()).toBeUndefined();
        });

        it('should return error if receivedBy is empty', function() {
            proofOfDelivery.receivedBy = undefined;

            expect(proofOfDelivery.validate()).toEqual({
                receivedBy: 'proofOfDelivery.required'
            });
        });

        it('should return error if deliveredBy is empty', function() {
            proofOfDelivery.deliveredBy = undefined;

            expect(proofOfDelivery.validate()).toEqual({
                deliveredBy: 'proofOfDelivery.required'
            });
        });

        it('should return error if receivedDate is empty', function() {
            proofOfDelivery.receivedDate = undefined;

            expect(proofOfDelivery.validate()).toEqual({
                receivedDate: 'proofOfDelivery.required'
            });
        });

        it('should return error if at least one of line items is invalid', function() {
            proofOfDelivery.lineItems[0].quantityAccepted = null;

            expect(proofOfDelivery.validate()).toEqual({
                lineItems: [{
                    quantityAccepted: 'proofOfDelivery.required'
                }]
            });

            proofOfDelivery.lineItems[1].quantityAccepted = null;

            expect(proofOfDelivery.validate()).toEqual({
                lineItems: [{
                    quantityAccepted: 'proofOfDelivery.required'
                }, {
                    quantityAccepted: 'proofOfDelivery.required'
                }]
            });

            proofOfDelivery.lineItems[1].quantityAccepted = 50;

            expect(proofOfDelivery.validate()).toEqual({
                lineItems: [{
                    quantityAccepted: 'proofOfDelivery.required'
                }]
            });
        });

    });
});
