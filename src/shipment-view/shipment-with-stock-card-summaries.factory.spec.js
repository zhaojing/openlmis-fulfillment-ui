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

xdescribe('shipmentWithStockCardSummariesFactory', function() {

    var ORDER_ID = 'order-id';

    var shipmentWithStockCardSummariesFactory, StockCardSummaryDataBuilder, OrderDataBuilder,
        ShipmentDataBuilder, ShipmentLineItemDataBuilder, OrderableDataBuilder, LotDataBuilder,
        ObjectReferenceDataBuilder, stockCardSummariesService, orderService, shipmentDraftService, $q,
        $rootScope, PageDataBuilder, order, shipment, stockCardSummaryOne, stockCardSummaryTwo,
        stockCardSummaryThree, stockCardSummaryFour, orderableOne, orderableTwo, lotOne, lotTwo,
        ShipmentLineItemWithSummary, OrderLineItemDataBuilder, OrderLineItem, shipmentService,
        shippedOrder;

    beforeEach(function() {
        module('referencedata-lot');
        module('referencedata-orderable');
        module('shipment-view');

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            orderService = $injector.get('orderService');
            LotDataBuilder = $injector.get('LotDataBuilder');
            shipmentDraftService = $injector.get('shipmentDraftService');
            OrderDataBuilder = $injector.get('OrderDataBuilder');
            ShipmentDataBuilder = $injector.get('ShipmentDataBuilder');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            stockCardSummariesService = $injector.get('stockCardSummariesService');
            shipmentService = $injector.get('shipmentService');
            ObjectReferenceDataBuilder = $injector.get('ObjectReferenceDataBuilder');
            ShipmentLineItemDataBuilder = $injector.get('ShipmentLineItemDataBuilder');
            StockCardSummaryDataBuilder = $injector.get('StockCardSummaryDataBuilder');
            OrderLineItemDataBuilder = $injector.get('OrderLineItemDataBuilder');
            PageDataBuilder = $injector.get('PageDataBuilder');
            OrderLineItem = $injector.get('OrderLineItem');
            shipmentWithStockCardSummariesFactory = $injector.get('shipmentWithStockCardSummariesFactory');
            ShipmentLineItemWithSummary = $injector.get('ShipmentLineItemWithSummary');
        });

        spyOn(stockCardSummariesService, 'getStockCardSummaries');
        spyOn(orderService, 'get');
        spyOn(shipmentDraftService, 'search');
        spyOn(shipmentService, 'search');

        orderableOne = new OrderableDataBuilder().build();
        orderableTwo = new OrderableDataBuilder().build();

        lotOne = new LotDataBuilder().build();
        lotTwo = new LotDataBuilder().build();

        stockCardSummaryOne = new StockCardSummaryDataBuilder()
            .withOrderable(orderableOne)
            .withLot(lotOne)
            .build();

        stockCardSummaryTwo = new StockCardSummaryDataBuilder()
            .withOrderable(orderableOne)
            .build();

        stockCardSummaryThree = new StockCardSummaryDataBuilder()
            .withOrderable(orderableTwo)
            .withLot(lotTwo)
            .build();

        stockCardSummaryFour = new StockCardSummaryDataBuilder().build();

        order = new OrderDataBuilder()
            .withId(ORDER_ID)
            .withOrderLineItems([
                new OrderLineItemDataBuilder()
                    .withOrderable(orderableOne)
                    .build(),
                new OrderLineItemDataBuilder()
                    .withOrderable(orderableTwo)
                    .build()
            ])
            .build();

        shippedOrder = new OrderDataBuilder()
            .withId(ORDER_ID)
            .withStatus('SHIPPED')
            .withOrderLineItems([
                new OrderLineItemDataBuilder()
                    .withOrderable(orderableOne)
                    .build(),
                new OrderLineItemDataBuilder()
                    .withOrderable(orderableTwo)
                    .build()
            ])
            .build();

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
                    .withOrderable(new ObjectReferenceDataBuilder().withId(orderableTwo.id))
                    .withLot(new ObjectReferenceDataBuilder().withId(lotTwo.id))
                    .withQuantityShipped(37)
                    .build()
            ])
            .build();
    });

    describe('get', function() {

        it('should throw exception if ID is not given', function() {
            expect(function() {
                shipmentWithStockCardSummariesFactory.get();
            }).toThrow('Order ID must be defined');
        });

        it('should reject if orderService rejects', function() {
            orderService.get.andReturn($q.reject());

            var rejected;
            shipmentWithStockCardSummariesFactory.get(ORDER_ID)
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toBe(true);
            expect(orderService.get).toHaveBeenCalledWith(ORDER_ID);
            expect(shipmentDraftService.search).not.toHaveBeenCalled();
            expect(stockCardSummariesService.getStockCardSummaries).not.toHaveBeenCalled();
        });

        it('should reject if shipmentDraftService rejects', function() {
            orderService.get.andReturn($q.resolve(order));
            shipmentDraftService.search.andReturn($q.reject());

            var rejected;
            shipmentWithStockCardSummariesFactory.get(ORDER_ID)
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toBe(true);
            expect(orderService.get).toHaveBeenCalledWith(ORDER_ID);
            expect(shipmentDraftService.search).toHaveBeenCalledWith({
                orderId: ORDER_ID
            });
            expect(shipmentService.search).not.toHaveBeenCalled();
            expect(stockCardSummariesService.getStockCardSummaries).not.toHaveBeenCalled();
        });

        it('should reject if shipmentService rejects when order is shipped', function() {
            orderService.get.andReturn($q.resolve(shippedOrder));
            shipmentService.search.andReturn($q.reject());

            var rejected;
            shipmentWithStockCardSummariesFactory.get(ORDER_ID)
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toBe(true);
            expect(orderService.get).toHaveBeenCalledWith(ORDER_ID);
            expect(shipmentService.search).toHaveBeenCalledWith({
                orderId: ORDER_ID
            });
            expect(shipmentDraftService.search).not.toHaveBeenCalled();
            expect(stockCardSummariesService.getStockCardSummaries).not.toHaveBeenCalled();
        });

        it('should reject if creating shipment and stockCardSummariesService rejects', function() {
            orderService.get.andReturn($q.resolve(order));
            shipmentDraftService.search.andReturn($q.resolve(new PageDataBuilder().build()));
            stockCardSummariesService.getStockCardSummaries.andReturn($q.reject());

            var rejected;
            shipmentWithStockCardSummariesFactory.get(ORDER_ID)
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toBe(true);
            expect(orderService.get).toHaveBeenCalledWith(ORDER_ID);
            expect(shipmentDraftService.search).toHaveBeenCalledWith({
                orderId: ORDER_ID
            });
            expect(shipmentService.search).not.toHaveBeenCalled();
            expect(stockCardSummariesService.getStockCardSummaries).toHaveBeenCalledWith(
                order.program.id,
                order.supplyingFacility.id
            );
        });

        it('should reject if recreating shipment and stockCardSummariesService rejects', function() {
            orderService.get.andReturn($q.resolve(order));
            shipmentDraftService.search.andReturn($q.resolve(
                new PageDataBuilder()
                .withContent([shipment])
                .build()
            ));
            stockCardSummariesService.getStockCardSummaries.andReturn($q.reject());

            var rejected;
            shipmentWithStockCardSummariesFactory.get(ORDER_ID)
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toBe(true);
            expect(orderService.get).toHaveBeenCalledWith(ORDER_ID);
            expect(shipmentDraftService.search).toHaveBeenCalledWith({
                orderId: ORDER_ID
            });
            expect(shipmentService.search).not.toHaveBeenCalled();
            expect(stockCardSummariesService.getStockCardSummaries).toHaveBeenCalledWith(
                order.program.id,
                order.supplyingFacility.id
            );
        });

        it('should resolve if recreating shipment draft', function() {
            orderService.get.andReturn($q.resolve(order));
            shipmentDraftService.search.andReturn($q.resolve(
                new PageDataBuilder()
                .withContent([shipment])
                .build()
            ));
            stockCardSummariesService.getStockCardSummaries.andReturn($q.resolve([
                stockCardSummaryOne,
                stockCardSummaryTwo,
                stockCardSummaryThree,
                stockCardSummaryFour
            ]));

            var resolved;
            shipmentWithStockCardSummariesFactory.get(ORDER_ID)
            .then(function() {
                resolved = true;
            });
            $rootScope.$apply();

            expect(resolved).toBe(true);
            expect(orderService.get).toHaveBeenCalledWith(ORDER_ID);
            expect(shipmentDraftService.search).toHaveBeenCalledWith({
                orderId: ORDER_ID
            });
            expect(shipmentService.search).not.toHaveBeenCalled();
            expect(stockCardSummariesService.getStockCardSummaries).toHaveBeenCalledWith(
                order.program.id,
                order.supplyingFacility.id
            );
        });


        it('should resolve when order is shipped', function() {
            orderService.get.andReturn($q.resolve(shippedOrder));
            shipmentService.search.andReturn($q.resolve(
                new PageDataBuilder()
                .withContent([shipment])
                .build()
            ));
            stockCardSummariesService.getStockCardSummaries.andReturn($q.resolve([
                stockCardSummaryOne,
                stockCardSummaryTwo,
                stockCardSummaryThree,
                stockCardSummaryFour
            ]));

            var resolved;
            shipmentWithStockCardSummariesFactory.get(ORDER_ID)
            .then(function() {
                resolved = true;
            });
            $rootScope.$apply();

            expect(resolved).toBe(true);
            expect(orderService.get).toHaveBeenCalledWith(ORDER_ID);
            expect(shipmentService.search).toHaveBeenCalledWith({
                orderId: ORDER_ID
            });
            expect(shipmentDraftService.search).not.toHaveBeenCalled();
            expect(stockCardSummariesService.getStockCardSummaries).toHaveBeenCalledWith(
                shippedOrder.program.id,
                shippedOrder.supplyingFacility.id
            );
        });

        it('should resolve if creating new shipment', function() {
            orderService.get.andReturn($q.resolve(order));
            shipmentDraftService.search.andReturn($q.resolve(new PageDataBuilder().build()));
            stockCardSummariesService.getStockCardSummaries.andReturn($q.resolve([
                stockCardSummaryOne,
                stockCardSummaryTwo,
                stockCardSummaryThree,
                stockCardSummaryFour
            ]));

            var resolved;
            shipmentWithStockCardSummariesFactory.get(ORDER_ID)
            .then(function() {
                resolved = true;
            });
            $rootScope.$apply();

            expect(resolved).toBe(true);
            expect(orderService.get).toHaveBeenCalledWith(ORDER_ID);
            expect(shipmentDraftService.search).toHaveBeenCalledWith({
                orderId: ORDER_ID
            });
            expect(shipmentService.search).not.toHaveBeenCalled();
            expect(stockCardSummariesService.getStockCardSummaries).toHaveBeenCalledWith(
                order.program.id,
                order.supplyingFacility.id
            );
        });

    });

    describe('get method result when recreating shipment', function() {

        var result;

        beforeEach(function() {
            orderService.get.andReturn($q.resolve(order));
            shipmentDraftService.search.andReturn($q.resolve(
                new PageDataBuilder()
                .withContent([shipment])
                .build()
            ));
            stockCardSummariesService.getStockCardSummaries.andReturn($q.resolve([
                stockCardSummaryOne,
                stockCardSummaryTwo,
                stockCardSummaryThree,
                stockCardSummaryFour
            ]));

            shipmentWithStockCardSummariesFactory.get(ORDER_ID)
            .then(function(response) {
                result = response;
            });
            $rootScope.$apply();
        });

        it('should have order', function() {
            expect(result.order).toEqual(order);
        });

        it('should have notes', function() {
            expect(result.notes).toEqual(shipment.notes);
        });

        it('should not have extra summaries', function() {
            expect(result.lineItems.length).toBe(2);

            expect(result.lineItems[0].quantityShipped).toBe(12);
            expect(result.lineItems[0].orderable).toEqual(orderableOne);
            expect(result.lineItems[0].lot).toEqual(lotOne);
            expect(result.lineItems[0].summary).toEqual(stockCardSummaryOne);

            expect(result.lineItems[1].quantityShipped).toBe(37);
            expect(result.lineItems[1].orderable).toEqual(orderableTwo);
            expect(result.lineItems[1].lot).toEqual(lotTwo);
            expect(result.lineItems[1].summary).toEqual(stockCardSummaryThree);
        });

        it('should return instances of ShipmentLineItem as lineItems', function() {
            expect(result.lineItems.length).toBe(2);
            expect(result.lineItems[0] instanceof ShipmentLineItemWithSummary).toBe(true);
            expect(result.lineItems[1] instanceof ShipmentLineItemWithSummary).toBe(true);
        });

        it('should return instance of OrderLineItem as order line items', function() {
            expect(result.order.orderLineItems.length).toBe(2);
            expect(result.order.orderLineItems[0] instanceof OrderLineItem).toBe(true);
            expect(result.order.orderLineItems[1] instanceof OrderLineItem).toBe(true);
        });

        it('should set references to shipment line items for every order line item', function() {
            expect(result.order.orderLineItems[0].shipmentLineItems).toEqual([
                result.lineItems[0]
            ]);
            expect(result.order.orderLineItems[1].shipmentLineItems).toEqual([
                result.lineItems[1]
            ]);
        });

    });

    describe('get method result when creating new shipment', function() {

        var result;

        beforeEach(function() {
            orderService.get.andReturn($q.resolve(order));
            shipmentDraftService.search.andReturn($q.resolve(new PageDataBuilder().build()));
            stockCardSummariesService.getStockCardSummaries.andReturn($q.resolve([
                stockCardSummaryOne,
                stockCardSummaryTwo,
                stockCardSummaryThree,
                stockCardSummaryFour
            ]));

            shipmentWithStockCardSummariesFactory.get(ORDER_ID)
            .then(function(response) {
                result = response;
            });
            $rootScope.$apply();
        });

        it('should have order', function() {
            expect(result.order).toEqual(order);
        });

        it('should not have notes', function() {
            expect(result.notes).toBeUndefined();
        });

        it('should ignore summaries that does not match order orderables', function() {
            expect(result.lineItems.length).toBe(3);

            expect(result.lineItems[0].quantityShipped).toBe(0);
            expect(result.lineItems[0].orderable).toEqual(orderableOne);
            expect(result.lineItems[0].lot).toBe(null);
            expect(result.lineItems[0].summary).toEqual(stockCardSummaryTwo);

            expect(result.lineItems[1].quantityShipped).toBe(0);
            expect(result.lineItems[1].orderable).toEqual(orderableOne);
            expect(result.lineItems[1].lot).toEqual(lotOne);
            expect(result.lineItems[1].summary).toEqual(stockCardSummaryOne);

            expect(result.lineItems[2].quantityShipped).toBe(0);
            expect(result.lineItems[2].orderable).toEqual(orderableTwo);
            expect(result.lineItems[2].lot).toEqual(lotTwo);
            expect(result.lineItems[2].summary).toEqual(stockCardSummaryThree);
        });

        it('should return instances of ShipmentLineItem as lineItems', function() {
            expect(result.lineItems.length).toBe(3);
            expect(result.lineItems[0] instanceof ShipmentLineItemWithSummary).toBe(true);
            expect(result.lineItems[1] instanceof ShipmentLineItemWithSummary).toBe(true);
            expect(result.lineItems[2] instanceof ShipmentLineItemWithSummary).toBe(true);
        });

        it('should return instance of OrderLineItem as order line items', function() {
            expect(result.order.orderLineItems.length).toBe(2);
            expect(result.order.orderLineItems[0] instanceof OrderLineItem).toBe(true);
            expect(result.order.orderLineItems[1] instanceof OrderLineItem).toBe(true);
        });

        it('should set references to shipment line items for every order line item', function() {
            expect(result.order.orderLineItems[0].shipmentLineItems).toEqual([
                result.lineItems[0],
                result.lineItems[1]
            ]);
            expect(result.order.orderLineItems[1].shipmentLineItems).toEqual([
                result.lineItems[2]
            ]);
        });

    });

});
