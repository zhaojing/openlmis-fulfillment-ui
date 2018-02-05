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

describe('ProofOfDeliveryLineItem', function() {

    var ProofOfDeliveryLineItem, proofOfDeliveryLineItem, ProofOfDeliveryLineItemDataBuilder;

    beforeEach(function() {
        module('proof-of-delivery');

        inject(function($injector) {
            ProofOfDeliveryLineItem = $injector.get('ProofOfDeliveryLineItem');
            ProofOfDeliveryLineItemDataBuilder = $injector.get('ProofOfDeliveryLineItemDataBuilder');
        });
    });

    describe('constructor', function() {

        it('should copy fields from JSON', function() {
            var json = new ProofOfDeliveryLineItemDataBuilder().buildJson();

            var result = new ProofOfDeliveryLineItem(json);

            expect(result.id).toEqual(json.id);
            expect(result.quantityShipped).toEqual(json.quantityShipped);
            expect(result.quantityReturned).toEqual(json.quantityReturned);
            expect(result.quantityReceived).toEqual(json.quantityReceived);
            expect(result.notes).toEqual(json.notes);
        });

    });

    describe('updateQuantityReturned', function() {

        beforeEach(function() {
            proofOfDeliveryLineItem = new ProofOfDeliveryLineItem(
                new ProofOfDeliveryLineItemDataBuilder().buildJson()
            );
        });

        it('should set quantity returned to 0 if quantity accepted is bigger than shipped', function() {
            proofOfDeliveryLineItem.quantityShipped = 100;
            proofOfDeliveryLineItem.quantityReceived = 101;
            proofOfDeliveryLineItem.quantityReturned = 10;

            proofOfDeliveryLineItem.updateQuantityReturned();

            expect(proofOfDeliveryLineItem.quantityReturned).toBe(0);
        });

        it('should set quantity returned to 0 if quantity accepted matches quantity shipped', function() {
            proofOfDeliveryLineItem.quantityShipped = 100;
            proofOfDeliveryLineItem.quantityReceived = 100;
            proofOfDeliveryLineItem.quantityReturned = 10;

            proofOfDeliveryLineItem.updateQuantityReturned();

            expect(proofOfDeliveryLineItem.quantityReturned).toBe(0);
        });

        it('should set quantity returned to quantity shipped if quantity accepted is 0', function() {
            proofOfDeliveryLineItem.quantityShipped = 100;
            proofOfDeliveryLineItem.quantityReceived = 0;
            proofOfDeliveryLineItem.quantityReturned = 10;

            proofOfDeliveryLineItem.updateQuantityReturned();

            expect(proofOfDeliveryLineItem.quantityReturned).toBe(100);
        });

        it('should unset quantity returned if quantity accepted is undefined', function() {
            proofOfDeliveryLineItem.quantityShipped = 100;
            proofOfDeliveryLineItem.quantityReceived = undefined;
            proofOfDeliveryLineItem.quantityReturned = 10;

            proofOfDeliveryLineItem.updateQuantityReturned();

            expect(proofOfDeliveryLineItem.quantityReturned).toBeUndefined();
        });

        it('should set quantity returned to quantity shipped if quantity accepted is negative', function() {
            proofOfDeliveryLineItem.quantityShipped = 100;
            proofOfDeliveryLineItem.quantityReceived = -20;
            proofOfDeliveryLineItem.quantityReturned = 10;

            proofOfDeliveryLineItem.updateQuantityReturned();

            expect(proofOfDeliveryLineItem.quantityReturned).toBe(100);
        });

        it('should calculate the quantity returned', function() {
            proofOfDeliveryLineItem.quantityShipped = 100;
            proofOfDeliveryLineItem.quantityReceived = 60;
            proofOfDeliveryLineItem.quantityReturned = 10;

            proofOfDeliveryLineItem.updateQuantityReturned();

            expect(proofOfDeliveryLineItem.quantityReturned).toBe(40);
        });

    });

    describe('validate', function() {

        beforeEach(function() {
            proofOfDeliveryLineItem = new ProofOfDeliveryLineItem(
                new ProofOfDeliveryLineItemDataBuilder().buildJson()
            );
        });

        it('should return undefined if line items is valid', function() {
            expect(proofOfDeliveryLineItem.validate()).toBeUndefined();
        });

        it('should return error if quantityReceived is empty', function() {
            proofOfDeliveryLineItem.quantityReceived = undefined;

            expect(proofOfDeliveryLineItem.validate()).toEqual({
                quantityReceived: 'proofOfDelivery.required'
            });
        });

        it('should return error if quantityReceived is negative', function() {
            proofOfDeliveryLineItem.quantityReceived = -1;

            expect(proofOfDeliveryLineItem.validate()).toEqual({
                quantityReceived: 'proofOfDelivery.positive'
            });
        });

        it('should return if trying to accept more than was shipped', function() {
            proofOfDeliveryLineItem.quantityReceived = 100;
            proofOfDeliveryLineItem.quantityShipped = 90;

            expect(proofOfDeliveryLineItem.validate()).toEqual({
                quantityReceived: 'proofOfDelivery.canNotAcceptMoreThanShipped'
            });
        });

    });

});
