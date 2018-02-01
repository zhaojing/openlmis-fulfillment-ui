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

ddescribe('ProofOfDeliveryLineItem', function() {

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
                quantityReceived: 'proofOfDeliveryView.required'
            });
        });

    });

});
