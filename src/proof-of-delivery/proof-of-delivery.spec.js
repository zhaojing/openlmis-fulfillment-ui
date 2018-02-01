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

ddescribe('ProofOfDelivery', function() {

    var ProofOfDelivery, ProofOfDeliveryLineItem, ProofOfDeliveryDataBuilder, json;

    beforeEach(function() {
        module('proof-of-delivery');

        inject(function($injector) {
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

            expect(result.proofOfDeliveryLineItems[0] instanceof ProofOfDeliveryLineItem).toBe(true);
            expect(result.proofOfDeliveryLineItems[1] instanceof ProofOfDeliveryLineItem).toBe(true);
            expect(result.proofOfDeliveryLineItems).toEqual([
                new ProofOfDeliveryLineItem(json.proofOfDeliveryLineItems[0]),
                new ProofOfDeliveryLineItem(json.proofOfDeliveryLineItems[1])
            ]);
        });

        it('should parse receivedDate', function() {
            var result = new ProofOfDelivery(json);

            expect(result.receivedDate).toEqual(new Date(json.receivedDate));
        });
    });

    describe('validate', function() {

        var proofOfDelivery;

        beforeEach(function() {
            proofOfDelivery = new ProofOfDelivery(json);
        });

        it('should return true if Proof of Delivery is valid', function() {
            expect(proofOfDelivery.validate()).toBeUndefined();
        });

        it('should return error if receivedBy is empty', function() {
            proofOfDelivery.receivedBy = undefined;

            expect(proofOfDelivery.validate()).toEqual({
                receivedBy: 'proofOfDeliveryView.required'
            });
        });

        it('should return error if deliveredBy is empty', function() {
            proofOfDelivery.deliveredBy = undefined;

            expect(proofOfDelivery.validate()).toEqual({
                deliveredBy: 'proofOfDeliveryView.required'
            });
        });

        it('should return error if receivedDate is empty', function() {
            proofOfDelivery.receivedDate = undefined;

            expect(proofOfDelivery.validate()).toEqual({
                receivedDate: 'proofOfDeliveryView.required'
            });
        });

        it('should return error if at least one of line items is invalid', function() {
            proofOfDelivery.proofOfDeliveryLineItems[0].quantityReceived = null;

            expect(proofOfDelivery.validate()).toEqual({
                proofOfDeliveryLineItems: [{
                    quantityReceived: 'proofOfDeliveryView.required'
                }]
            });

            proofOfDelivery.proofOfDeliveryLineItems[1].quantityReceived = null;

            expect(proofOfDelivery.validate()).toEqual({
                proofOfDeliveryLineItems: [{
                    quantityReceived: 'proofOfDeliveryView.required'
                }, {
                    quantityReceived: 'proofOfDeliveryView.required'
                }]
            });

            proofOfDelivery.proofOfDeliveryLineItems[1].quantityReceived = 50;

            expect(proofOfDelivery.validate()).toEqual({
                proofOfDeliveryLineItems: [{
                    quantityReceived: 'proofOfDeliveryView.required'
                }]
            });
        });

    });
});
