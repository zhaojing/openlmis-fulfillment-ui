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
            expect(result.quantityReceived).toEqual(json.quantityReceived);
            expect(result.quantityReturned).toEqual(json.quantityReturned);
            expect(result.notes).toEqual(json.notes);
        });

    });

    describe('updateQuantityAccepted', function() {

        beforeEach(function() {
            proofOfDeliveryLineItem = new ProofOfDeliveryLineItem(
                new ProofOfDeliveryLineItemDataBuilder().buildJson()
            );
        });

        it('should set quantity accepted to 0 if quantity returned is bigger than shipped', function() {
            proofOfDeliveryLineItem.quantityShipped = 100;
            proofOfDeliveryLineItem.quantityReturned = 101;
            proofOfDeliveryLineItem.quantityReceived = 10;

            proofOfDeliveryLineItem.updateQuantityAccepted();

            expect(proofOfDeliveryLineItem.quantityReceived).toBe(0);
        });

        it('should set quantity accepted to 0 if quantity returned matches quantity shipped', function() {
            proofOfDeliveryLineItem.quantityShipped = 100;
            proofOfDeliveryLineItem.quantityReturned = 100;
            proofOfDeliveryLineItem.quantityReceived = 10;

            proofOfDeliveryLineItem.updateQuantityAccepted();

            expect(proofOfDeliveryLineItem.quantityReceived).toBe(0);
        });

        it('should set quantity accepted to quantity shipped if quantity returned is 0', function() {
            proofOfDeliveryLineItem.quantityShipped = 100;
            proofOfDeliveryLineItem.quantityReturned = 0;
            proofOfDeliveryLineItem.quantityReceived = 10;

            proofOfDeliveryLineItem.updateQuantityAccepted();

            expect(proofOfDeliveryLineItem.quantityReceived).toBe(100);
        });

        it('should set quantity accepted to quantity shipped if quantity returned is undefined', function() {
            proofOfDeliveryLineItem.quantityShipped = 100;
            proofOfDeliveryLineItem.quantityReturned = undefined;
            proofOfDeliveryLineItem.quantityReceived = 10;

            proofOfDeliveryLineItem.updateQuantityAccepted();

            expect(proofOfDeliveryLineItem.quantityReceived).toBe(100);
        });

        it('should set quantity accepted to quantity shipped if quantity returned is negative', function() {
            proofOfDeliveryLineItem.quantityShipped = 100;
            proofOfDeliveryLineItem.quantityReturned = -20;
            proofOfDeliveryLineItem.quantityReceived = 10;

            proofOfDeliveryLineItem.updateQuantityAccepted();

            expect(proofOfDeliveryLineItem.quantityReceived).toBe(100);
        });

        it('should calculate the quantity accepted', function() {
            proofOfDeliveryLineItem.quantityShipped = 100;
            proofOfDeliveryLineItem.quantityReturned = 60;
            proofOfDeliveryLineItem.quantityReceived = 10;

            proofOfDeliveryLineItem.updateQuantityAccepted();

            expect(proofOfDeliveryLineItem.quantityReceived).toBe(40);
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

        it('should return error if quantityReturned is empty', function() {
            proofOfDeliveryLineItem.quantityReturned = undefined;

            expect(proofOfDeliveryLineItem.validate()).toEqual({
                quantityReturned: 'proofOfDeliveryView.required'
            });
        });

        it('should return error if quantityReturned is negative', function() {
            proofOfDeliveryLineItem.quantityReturned = -1;

            expect(proofOfDeliveryLineItem.validate()).toEqual({
                quantityReturned: 'proofOfDeliveryView.positive'
            });
        });

        it('should return if trying to return more than was shipped', function() {
            proofOfDeliveryLineItem.quantityReturned = 100;
            proofOfDeliveryLineItem.quantityShipped = 90;

            expect(proofOfDeliveryLineItem.validate()).toEqual({
                quantityReturned: 'proofOfDeliveryView.canNotReturnMoreThanShipped'
            });
        });

    });

});
