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

describe('orderWithStockCardSummariesFactory', function() {

    var $q, $rootScope, orderService, orderWithStockCardSummariesFactory, stockCardSummariesService, basicOrderFactory, OrderDataBuilder, StockCardSummaryDataBuilder, OrderLineItemDataBuilder,
        order, stockCardSummaries;

    beforeEach(function() {
        module('order-details');

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            orderService = $injector.get('orderService');
            orderWithStockCardSummariesFactory = $injector.get('orderWithStockCardSummariesFactory');
            stockCardSummariesService = $injector.get('stockCardSummariesService');
            basicOrderFactory = $injector.get('basicOrderFactory');
            OrderDataBuilder = $injector.get('OrderDataBuilder');
            StockCardSummaryDataBuilder = $injector.get('StockCardSummaryDataBuilder');
            OrderLineItemDataBuilder = $injector.get('OrderLineItemDataBuilder');
        });

        order = new OrderDataBuilder()
            .withOrderLineItem(new OrderLineItemDataBuilder().build())
            .withOrderLineItem(new OrderLineItemDataBuilder().build())
            .withOrderLineItem(new OrderLineItemDataBuilder().build())
            .build();

        stockCardSummaries = [
            new StockCardSummaryDataBuilder().withOrderable(order.orderLineItems[0].orderable).build(),
            new StockCardSummaryDataBuilder().withOrderable(order.orderLineItems[0].orderable).build(),
            new StockCardSummaryDataBuilder().withOrderable(order.orderLineItems[2].orderable).build(),
            new StockCardSummaryDataBuilder().build()
        ];

        spyOn(orderService, 'get').andReturn($q.resolve(order));
        spyOn(stockCardSummariesService, 'getStockCardSummaries').andReturn($q.resolve(stockCardSummaries));
        spyOn(basicOrderFactory, 'buildFromResponse').andCallFake(function(param) {
            return param;
        });
    });

    describe('getOrderWithSummaries', function() {

        it('should return promise', function() {
            var result = orderWithStockCardSummariesFactory.getOrderWithSummaries('id');
            expect(angular.isFunction(result.then)).toBe(true);
        });

        it('should reject promise if get order fails', function() {
            var result;

            orderService.get.andReturn($q.reject());

            orderWithStockCardSummariesFactory.getOrderWithSummaries('id')
            .catch(function() {
                result = 'rejected';
            });
            $rootScope.$apply();

            expect(result).toEqual('rejected');
        });

        it('should reject promise if get stock card summaries fails', function() {
            var result;

            stockCardSummariesService.getStockCardSummaries.andReturn($q.reject());

            orderWithStockCardSummariesFactory.getOrderWithSummaries('id')
            .catch(function() {
                result = 'rejected';
            });
            $rootScope.$apply();

            expect(result).toEqual('rejected');
        });

        it('should assign stock card summaries to proper order line item', function() {
            var result;

            orderWithStockCardSummariesFactory.getOrderWithSummaries('id')
            .then(function(response) {
                result = response;
            });
            $rootScope.$apply();

            expect(orderService.get).toHaveBeenCalledWith('id', 'lastUpdater');
            expect(stockCardSummariesService.getStockCardSummaries).toHaveBeenCalledWith(order.program.id, order.supplyingFacility.id);
            expect(result.orderLineItems[0].summaries).toEqual([stockCardSummaries[0], stockCardSummaries[1]]);
            expect(result.orderLineItems[1].summaries).toEqual([]);
            expect(result.orderLineItems[2].summaries).toEqual([stockCardSummaries[2]]);
        });
    });
});
