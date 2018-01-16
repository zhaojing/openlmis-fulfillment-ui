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

ddescribe('shipmentDraftFactory', function() {

    var shipmentDraftFactory, shipmentService, $rootScope, $q, ShipmentDataBuilder, PageDataBuilder,
        OrderDataBuilder, StockCardSummaryDataBuilder, OrderableDataBuilder, LotDataBuilder,
        OrderLineItemDataBuilder, order, shipmentDraft, stockCardSummaries, orderableOne,
        orderableTwo, lotOne, lotTwo, stockCardSummaryOne, stockCardSummaryTwo,
        stockCardSummaryThree, stockCardSummaryFour;

    beforeEach(function() {
        module('referencedata-lot');
        module('referencedata-orderable');
        module('shipment-view');

        inject(function($injector) {
            shipmentDraftFactory = $injector.get('shipmentDraftFactory');
            shipmentService = $injector.get('shipmentService');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            ShipmentDataBuilder = $injector.get('ShipmentDataBuilder');
            OrderDataBuilder = $injector.get('OrderDataBuilder');
            StockCardSummaryDataBuilder = $injector.get('StockCardSummaryDataBuilder');
            PageDataBuilder = $injector.get('PageDataBuilder');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            LotDataBuilder = $injector.get('LotDataBuilder');
            OrderLineItemDataBuilder = $injector.get('OrderLineItemDataBuilder');
        });

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

        stockCardSummaries = [
            stockCardSummaryOne,
            stockCardSummaryTwo,
            stockCardSummaryThree,
            stockCardSummaryFour
        ];

        order = new OrderDataBuilder()
            .withOrderLineItems([
                new OrderLineItemDataBuilder()
                    .withOrderable(orderableOne)
                    .build(),
                new OrderLineItemDataBuilder()
                    .withOrderable(orderableTwo)
                    .build()
            ])
            .build();

        shipmentDraft = new ShipmentDataBuilder().build();
    });

    describe('getForOrder', function() {

        it('should return draft if it is returned by the server', function() {
            shipmentService.search.andReturn($q.resolve(
                new PageDataBuilder()
                .withContent([
                    shipmentDraft
                ])
                .build()
            ));

            var result;
            shipmentDraftFactory.getForOrder(order, stockCardSummaries)
            .then(function(shipmentDraft) {
                result = shipmentDraft;
            });
            $rootScope.$apply();

            expect(result).toEqual(shipmentDraft);
        });

        it('should create draft based on the summaries if it does not yet exist', function() {
            shipmentService.search.andReturn($q.resolve(new PageDataBuilder().build()));

            var result;
            shipmentDraftFactory.getForOrder(order, stockCardSummaries)
            .then(function(shipmentDraft) {
                result = shipmentDraft;
            });
            $rootScope.$apply();

            expect(result.order).toEqual(order);
            expect(result.notes).toBeUndefined();
            expect(result.shipmentLineItems.length).toBe(3);

            expect(result.shipmentLineItems[0].orderable).toEqual(stockCardSummaries[0].orderable);
            expect(result.shipmentLineItems[0].lot).toEqual(stockCardSummaries[0].lot);
            expect(result.shipmentLineItems[0].quantityShipped).toBe(0);

            expect(result.shipmentLineItems[1].orderable).toEqual(stockCardSummaries[1].orderable);
            expect(result.shipmentLineItems[1].lot).toEqual(stockCardSummaries[1].lot);
            expect(result.shipmentLineItems[1].quantityShipped).toBe(0);

            expect(result.shipmentLineItems[2].orderable).toEqual(stockCardSummaries[2].orderable);
            expect(result.shipmentLineItems[2].lot).toEqual(stockCardSummaries[2].lot);
            expect(result.shipmentLineItems[2].quantityShipped).toBe(0);
        });

        it('should reject if shipmentService rejects', function() {
            shipmentService.search.andReturn($q.reject());

            var rejected;
            shipmentDraftFactory.getForOrder(order, stockCardSummaries)
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

        it('should throw exception if no order id is given', function() {
            expect(function() {
                shipmentDraftFactory.getForOrder();
            }).toThrow('Order must be defined');
        });

    });

});
