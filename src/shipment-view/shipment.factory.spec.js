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

describe('shipmentFactory', function() {

    var shipmentFactory, shipmentService, shipmentDraftService, ORDER_STATUS, $rootScope, $q,
        ShipmentDataBuilder, PageDataBuilder, OrderDataBuilder, StockCardSummaryDataBuilder,
        OrderableDataBuilder, LotDataBuilder, OrderLineItemDataBuilder, order, shipment,
        stockCardSummaries, orderableOne, orderableTwo, lotOne, lotTwo, searchPromise,
        shipmentLineItems, ShipmentLineItemDataBuilder, orderableThree;

    beforeEach(function() {
        module('referencedata-lot');
        module('referencedata-orderable');
        module('shipment-view');

        inject(function($injector) {
            shipmentFactory = $injector.get('shipmentFactory');
            shipmentService = $injector.get('shipmentService');
            shipmentDraftService = $injector.get('shipmentDraftService');
            ORDER_STATUS = $injector.get('ORDER_STATUS');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            ShipmentDataBuilder = $injector.get('ShipmentDataBuilder');
            OrderDataBuilder = $injector.get('OrderDataBuilder');
            StockCardSummaryDataBuilder = $injector.get('StockCardSummaryDataBuilder');
            PageDataBuilder = $injector.get('PageDataBuilder');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            LotDataBuilder = $injector.get('LotDataBuilder');
            OrderLineItemDataBuilder = $injector.get('OrderLineItemDataBuilder');
            ShipmentLineItemDataBuilder = $injector.get('ShipmentLineItemDataBuilder');
        });

        orderableOne = new OrderableDataBuilder().build();
        orderableTwo = new OrderableDataBuilder().build();
        orderableThree = new OrderableDataBuilder().build();

        lotOne = new LotDataBuilder().build();
        lotTwo = new LotDataBuilder().build();

        stockCardSummaries = [
            new StockCardSummaryDataBuilder()
                .withOrderable(orderableOne)
                .withLot(lotOne)
                .build(),
            new StockCardSummaryDataBuilder()
                .withOrderable(orderableOne)
                .build(),
            new StockCardSummaryDataBuilder()
                .withOrderable(orderableTwo)
                .withLot(lotTwo)
                .build(),
            new StockCardSummaryDataBuilder()
                .build()
        ];

        order = new OrderDataBuilder()
            .withOrderLineItems([
                new OrderLineItemDataBuilder()
                    .withOrderable(orderableOne)
                    .build(),
                new OrderLineItemDataBuilder()
                    .withOrderable(orderableTwo)
                    .build(),
                new OrderLineItemDataBuilder()
                    .withOrderable(orderableThree)
                    .build()
            ])
            .build();

        shipmentLineItems = [
            new ShipmentLineItemDataBuilder()
                .withOrderable(stockCardSummaries[0].orderable)
                .withLot(stockCardSummaries[0].lot)
                .withQuantityShipped(0)
                .build(),
            new ShipmentLineItemDataBuilder()
                .withOrderable(stockCardSummaries[1].orderable)
                .withLot(stockCardSummaries[1].lot)
                .withQuantityShipped(0)
                .build(),
            new ShipmentLineItemDataBuilder()
                .withOrderable(stockCardSummaries[2].orderable)
                .withLot(stockCardSummaries[2].lot)
                .withQuantityShipped(0)
                .build(),
            new ShipmentLineItemDataBuilder()
                .withOrderable(order.orderLineItems[2].orderable)
                .withoutLot()
                .withQuantityShipped(0)
                .build()
        ];

        shipment = new ShipmentDataBuilder()
            .withOrder(order)
            .withLineItems(shipmentLineItems)
            .buildWithoutId();

        searchPromise = $q.defer();

        spyOn(shipmentService, 'search').andReturn(searchPromise.promise);
        spyOn(shipmentDraftService, 'search').andReturn(searchPromise.promise);
        spyOn(shipmentDraftService, 'save').andReturn($q.when(shipment));
    });

    describe('getForOrder', function() {

        it('should return draft returned if order is not shipped', function() {
            searchPromise.resolve(
                new PageDataBuilder()
                .withContent([
                    shipment
                ])
                .build()
            );

            var result;
            shipmentFactory.getForOrder(order, stockCardSummaries)
            .then(function(shipmentDraft) {
                result = shipmentDraft;
            });
            $rootScope.$apply();

            expect(result).toEqual(shipment);
            expect(shipmentService.search).not.toHaveBeenCalled();
            expect(shipmentDraftService.search).toHaveBeenCalledWith({
                orderId: order.id
            });
        });

        it('should return draft returned if order is not shipped', function() {
            order.status = ORDER_STATUS.SHIPPED;

            searchPromise.resolve(
                new PageDataBuilder()
                .withContent([
                    shipment
                ])
                .build()
            );

            var result;
            shipmentFactory.getForOrder(order, stockCardSummaries)
            .then(function(shipmentDraft) {
                result = shipmentDraft;
            });
            $rootScope.$apply();

            expect(result).toEqual(shipment);
            expect(shipmentDraftService.search).not.toHaveBeenCalled();
            expect(shipmentService.search).toHaveBeenCalledWith({
                orderId: order.id
            });
        });

        it('should create draft based on the summaries if it does not yet exist', function() {
            searchPromise.resolve(new PageDataBuilder().build());

            var result;
            shipmentFactory.getForOrder(order, stockCardSummaries)
            .then(function(shipmentDraft) {
                result = shipmentDraft;
            });
            $rootScope.$apply();

            expect(result.order).toEqual(order);
            expect(result.lineItems.length).toBe(4);

            expect(result.lineItems[0].orderable).toEqual(stockCardSummaries[0].orderable);
            expect(result.lineItems[0].lot).toEqual(stockCardSummaries[0].lot);
            expect(result.lineItems[0].quantityShipped).toBe(0);

            expect(result.lineItems[1].orderable).toEqual(stockCardSummaries[1].orderable);
            expect(result.lineItems[1].lot).toEqual(stockCardSummaries[1].lot);
            expect(result.lineItems[1].quantityShipped).toBe(0);

            expect(result.lineItems[2].orderable).toEqual(stockCardSummaries[2].orderable);
            expect(result.lineItems[2].lot).toEqual(stockCardSummaries[2].lot);
            expect(result.lineItems[2].quantityShipped).toBe(0);

            expect(result.lineItems[3].orderable).toEqual(order.orderLineItems[2].orderable);
            expect(result.lineItems[3].lot).toBeUndefined();
            expect(result.lineItems[3].quantityShipped).toBe(0);
        });

        it('should save draft based on the summaries if it does not yet exist', function() {
            searchPromise.resolve(new PageDataBuilder().build());

            var result;
            shipmentFactory.getForOrder(order, stockCardSummaries)
            .then(function(shipmentDraft) {
                result = shipmentDraft;
            });
            $rootScope.$apply();

            expect(shipmentDraftService.save).toHaveBeenCalled();
            expect(result.order).toEqual(order);
            expect(result.lineItems.length).toBe(4);
        });

        it('should reject if shipmentService rejects', function() {
            searchPromise.reject();

            var rejected;
            shipmentFactory.getForOrder(order, stockCardSummaries)
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

        it('should throw exception if no order id is given', function() {
            expect(function() {
                shipmentFactory.getForOrder();
            }).toThrow('Order must be defined');
        });

    });

});
