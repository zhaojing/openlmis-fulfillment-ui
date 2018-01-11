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

describe('OrderLineItem', function() {

    var OrderLineItem, OrderLineItemDataBuilder, ShipmentLineItemWithSummaryDataBuilder;

    beforeEach(function() {
        module('shipment-view');

        inject(function($injector) {
            OrderLineItem = $injector.get('OrderLineItem');
            OrderLineItemDataBuilder = $injector.get('OrderLineItemDataBuilder');
            ShipmentLineItemWithSummaryDataBuilder = $injector.get('ShipmentLineItemWithSummaryDataBuilder');
        });
    });

    describe('contructor', function() {

        it('should set shipmentLineItems', function() {
            var shipmentLineItems = [
                new ShipmentLineItemWithSummaryDataBuilder().build(),
                new ShipmentLineItemWithSummaryDataBuilder().build()
            ];

            var result = new OrderLineItem(
                new OrderLineItemDataBuilder().build(),
                shipmentLineItems
            );

            expect(result.shipmentLineItems).toEqual(shipmentLineItems);
        });

    });

    describe('calculateFillQuantity', function() {

        var orderLineItem;

        beforeEach(function() {
            orderLineItem = new OrderLineItem(
                new OrderLineItemDataBuilder().build(), [
                    new ShipmentLineItemWithSummaryDataBuilder().build(),
                    new ShipmentLineItemWithSummaryDataBuilder().build()
                ]
            );
        });

        it('should return 0 if there are no shipment line items', function() {
            orderLineItem.shipmentLineItems = [];

            var result = orderLineItem.calculateFillQuantity();

            expect(result).toBe(0);
        });

        it('should calculate fill quantity', function() {
            orderLineItem.shipmentLineItems = [
                new ShipmentLineItemWithSummaryDataBuilder()
                    .withQuantityShipped(20)
                    .build(),
                new ShipmentLineItemWithSummaryDataBuilder()
                    .withQuantityShipped(7)
                    .build()
            ];

            var result = orderLineItem.calculateFillQuantity();

            expect(result).toBe(27);
        });

        it('should parse string to integers', function() {
            orderLineItem.shipmentLineItems = [
                new ShipmentLineItemWithSummaryDataBuilder()
                    .withQuantityShipped('20')
                    .build(),
                new ShipmentLineItemWithSummaryDataBuilder()
                    .withQuantityShipped('7')
                    .build()
            ];

            var result = orderLineItem.calculateFillQuantity();

            expect(result).toBe(27);
        });

        it('should use 0 if shipped quantity is undefined', function() {
            orderLineItem.shipmentLineItems = [
                new ShipmentLineItemWithSummaryDataBuilder()
                    .withQuantityShipped(20)
                    .build(),
                new ShipmentLineItemWithSummaryDataBuilder()
                    .withQuantityShipped(null)
                    .build()
            ];

            var result = orderLineItem.calculateFillQuantity();

            expect(result).toBe(20);
        });

    });

});
