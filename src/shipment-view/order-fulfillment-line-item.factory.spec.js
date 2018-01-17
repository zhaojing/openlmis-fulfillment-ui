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

describe('orderFulfillmentLineItemFactory', function() {

    var orderFulfillmentLineItemFactory, OrderLineItemDataBuilder, OrderResponseDataBuilder,
        ShipmentDataBuilder, ObjectReferenceDataBuilder, ShipmentLineItemDataBuilder,
        StockCardSummaryDataBuilder, LotDataBuilder, OrderableDataBuilder, ShipmentLineItemWithSummary;

    var firstOrderLineItem, secondOrderLineItem, thirdOrderLineItem, fourthOrderLineItem,
        fifthOrderLineItem, order, shipment, ORDER_ID, orderableOne,
        lotOne, lotTwo, lotThree, lotFour, lotFive, stockCardSummaries;

    beforeEach(function() {
        module('shipment-view');
        module('referencedata-lot');
        module('referencedata-orderable');

        inject(function($injector) {
            orderFulfillmentLineItemFactory = $injector.get('orderFulfillmentLineItemFactory');
            OrderLineItemDataBuilder = $injector.get('OrderLineItemDataBuilder');
            OrderResponseDataBuilder = $injector.get("OrderResponseDataBuilder");
            ShipmentLineItemDataBuilder = $injector.get("ShipmentLineItemDataBuilder");
            ShipmentDataBuilder = $injector.get("ShipmentDataBuilder");
            ObjectReferenceDataBuilder = $injector.get("ObjectReferenceDataBuilder");
            StockCardSummaryDataBuilder = $injector.get("StockCardSummaryDataBuilder");
            LotDataBuilder = $injector.get("LotDataBuilder");
            OrderableDataBuilder = $injector.get("OrderableDataBuilder");
            ShipmentLineItemWithSummary = $injector.get("ShipmentLineItemWithSummary");

        });

        ORDER_ID = 'order-id';

        orderableOne = new OrderableDataBuilder().build();

        lotOne = new LotDataBuilder().withExpirationDate('2017-02-02T05:59:51.993Z').build();
        lotTwo = new LotDataBuilder().withExpirationDate('2017-02-02T05:59:51.993Z').build();
        lotThree = new LotDataBuilder().withExpirationDate('2017-04-04T05:59:51.993Z').build();
        lotFour = new LotDataBuilder().withExpirationDate('2017-03-03T05:59:51.993Z').build();
        lotFive = new LotDataBuilder().withExpirationDate(null).build();

        firstOrderLineItem = new OrderLineItemDataBuilder().withOrderable(orderableOne).build();
        secondOrderLineItem = new OrderLineItemDataBuilder().withOrderable(orderableOne).build();
        thirdOrderLineItem = new OrderLineItemDataBuilder().withOrderable(orderableOne).build();
        fourthOrderLineItem = new OrderLineItemDataBuilder().withOrderable(orderableOne).build();
        fifthOrderLineItem = new OrderLineItemDataBuilder().withOrderable(orderableOne).build();

        order = new OrderResponseDataBuilder().withOrderLineItems([
            firstOrderLineItem,
            secondOrderLineItem,
            thirdOrderLineItem,
            fourthOrderLineItem,
            fifthOrderLineItem
        ]);

        stockCardSummaries = [
            new StockCardSummaryDataBuilder().withOrderable(orderableOne).withLot(lotOne).withExtraData({ vvmStatus: 'STAGE_1'}).build(),
            new StockCardSummaryDataBuilder().withOrderable(orderableOne).withLot(lotTwo).withExtraData({ vvmStatus: 'STAGE_2'}).build(),
            new StockCardSummaryDataBuilder().withOrderable(orderableOne).withLot(lotThree).withExtraData({ vvmStatus: 'STAGE_2'}).build(),
            new StockCardSummaryDataBuilder().withOrderable(orderableOne).withLot(lotFour).withExtraData({ vvmStatus: 'STAGE_2'}).build(),
            new StockCardSummaryDataBuilder().withOrderable(orderableOne).withLot(lotFive).withExtraData({ vvmStatus: 'STAGE_1'}).build(),
            new StockCardSummaryDataBuilder().build()
        ];

        shipment = new ShipmentDataBuilder()
            .withOrder(
                new ObjectReferenceDataBuilder()
                .withId(ORDER_ID)
                .withResource('order')
                .build()
            )
            .withLineItems([
                new ShipmentLineItemDataBuilder()
                    .withOrderable(new ObjectReferenceDataBuilder().withId(orderableOne.id))
                    .withLot(new ObjectReferenceDataBuilder().withId(lotOne.id))
                    .withQuantityShipped(12)
                    .build(),
                new ShipmentLineItemDataBuilder()
                    .withOrderable(new ObjectReferenceDataBuilder().withId(orderableOne.id))
                    .withLot(new ObjectReferenceDataBuilder().withId(lotTwo.id))
                    .withQuantityShipped(37)
                    .build(),
                new ShipmentLineItemDataBuilder()
                    .withOrderable(new ObjectReferenceDataBuilder().withId(orderableOne.id))
                    .withLot(new ObjectReferenceDataBuilder().withId(lotThree.id))
                    .withQuantityShipped(15)
                    .build(),
                new ShipmentLineItemDataBuilder()
                    .withOrderable(new ObjectReferenceDataBuilder().withId(orderableOne.id))
                    .withLot(new ObjectReferenceDataBuilder().withId(lotFour.id))
                    .withQuantityShipped(10)
                    .build(),
                new ShipmentLineItemDataBuilder()
                    .withOrderable(new ObjectReferenceDataBuilder().withId(orderableOne.id))
                    .withLot(new ObjectReferenceDataBuilder().withId(lotFive.id))
                    .withQuantityShipped(9)
                    .build()
            ])
            .build();
    });

    describe('get', function() {

        var result;

        beforeEach(function() {
            result = orderFulfillmentLineItemFactory.get(order, shipment, stockCardSummaries);
        });

        it('should not return extra summaries', function() {
            expect(result.length).toBe(5);

            expect(result[0].shipmentLineItems.length).toBe(5);
            expect(result[0].shipmentLineItems[0].summary).toEqual(stockCardSummaries[1]);
            expect(result[0].shipmentLineItems[1].summary).toEqual(stockCardSummaries[3]);
            expect(result[0].shipmentLineItems[2].summary).toEqual(stockCardSummaries[2]);
            expect(result[0].shipmentLineItems[3].summary).toEqual(stockCardSummaries[0]);
            expect(result[0].shipmentLineItems[4].summary).toEqual(stockCardSummaries[4]);
        });

        it('should sort line items', function() {
            expect(result.length).toBe(5);

            expect(result[0].shipmentLineItems.length).toBe(5);
            expect(result[0].orderable).toEqual(orderableOne);

            expect(result[0].shipmentLineItems[0].quantityShipped).toBe(37);
            expect(result[0].shipmentLineItems[0].lot).toEqual(lotTwo);

            expect(result[0].shipmentLineItems[1].quantityShipped).toBe(10);
            expect(result[0].shipmentLineItems[1].lot).toEqual(lotFour);

            expect(result[0].shipmentLineItems[2].quantityShipped).toBe(15);
            expect(result[0].shipmentLineItems[2].lot).toEqual(lotThree);

            expect(result[0].shipmentLineItems[3].quantityShipped).toBe(12);
            expect(result[0].shipmentLineItems[3].lot).toEqual(lotOne);

            expect(result[0].shipmentLineItems[4].quantityShipped).toBe(9);
            expect(result[0].shipmentLineItems[4].lot).toEqual(lotFive);
        });

        it('should return instances of ShipmentLineItem as shipmentLineItems', function() {
            expect(result.length).toBe(5);
            expect(result[0].shipmentLineItems[0] instanceof ShipmentLineItemWithSummary).toBe(true);
        });

    });

});
