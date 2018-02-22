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

describe('fulfillingLineItemFactory', function() {

    var fulfillingLineItemFactory, orderLineItems, proofOfDeliveryLineItems,
        OrderLineItemDataBuilder, ProofOfDeliveryLineItemDataBuilder;

    beforeEach(function() {
        module('proof-of-delivery-view');

        inject(function($injector) {
            fulfillingLineItemFactory = $injector.get('fulfillingLineItemFactory');
            OrderLineItemDataBuilder = $injector.get('OrderLineItemDataBuilder');
            ProofOfDeliveryLineItemDataBuilder = $injector.get('ProofOfDeliveryLineItemDataBuilder');
        });

        orderLineItems = [
            new OrderLineItemDataBuilder().build(),
            new OrderLineItemDataBuilder().build()
        ];

        proofOfDeliveryLineItems = [
            new ProofOfDeliveryLineItemDataBuilder()
                .withOrderable(orderLineItems[1].orderable)
                .build(),
            new ProofOfDeliveryLineItemDataBuilder()
                .withOrderable(orderLineItems[0].orderable)
                .build(),
            new ProofOfDeliveryLineItemDataBuilder()
                .withOrderable(orderLineItems[0].orderable)
                .build(),
        ];
    });

    describe('groupByOrderLineItem', function() {

        it('should return empty object for empty list of order line items', function() {
            orderLineItems = [];

            expect(
                fulfillingLineItemFactory.groupByOrderLineItem(
                    orderLineItems,
                    proofOfDeliveryLineItems
                )
            ).toEqual({});
        });

        it('should return map of empty lists for empty list of proof of delivery line items', function() {
            proofOfDeliveryLineItems = [];

            var result = fulfillingLineItemFactory.groupByOrderLineItem(
                orderLineItems,
                proofOfDeliveryLineItems
            );

            expect(result[orderLineItems[0].id]).toEqual([]);
            expect(result[orderLineItems[1].id]).toEqual([]);
        });

        it('should throw exception for undefined list of order line items', function() {
            expect(function() {
                fulfillingLineItemFactory.groupByOrderLineItem(undefined, proofOfDeliveryLineItems);
            }).toThrow();
        });

        it('should throw exception for undefined list of proof of delivery line items', function() {
            expect(function() {
                fulfillingLineItemFactory.groupByOrderLineItem(orderLineItem, undefined);
            }).toThrow();
        });

        it('should group proof of delivery line items by order line items', function() {
            var result = fulfillingLineItemFactory.groupByOrderLineItem(
                orderLineItems,
                proofOfDeliveryLineItems
            );

            expect(result[orderLineItems[0].id]).toEqual([
                proofOfDeliveryLineItems[1],
                proofOfDeliveryLineItems[2]
            ]);

            expect(result[orderLineItems[1].id]).toEqual([
                proofOfDeliveryLineItems[0]
            ]);
        });

    });

});
