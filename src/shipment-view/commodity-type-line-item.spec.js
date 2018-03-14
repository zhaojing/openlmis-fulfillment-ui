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

describe('CommodityTypeLineItem', function() {

    var CommodityTypeLineItem, StockCardSummaryDataBuilder, summary, tradeItemLineItems,
        TradeItemLineItemDataBuilder, orderQuantity, CommodityTypeLineItemDataBuilder,
        commodityTypeLineItem, OrderableDataBuilder;

    beforeEach(function() {
        module('shipment-view');
        
        inject(function($injector) {
            CommodityTypeLineItem = $injector.get('CommodityTypeLineItem');
            TradeItemLineItemDataBuilder = $injector.get('TradeItemLineItemDataBuilder');
            StockCardSummaryDataBuilder = $injector.get('StockCardSummaryDataBuilder');
            CommodityTypeLineItemDataBuilder = $injector.get('CommodityTypeLineItemDataBuilder');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
        });

        summary = new StockCardSummaryDataBuilder()
            .withOrderable(new OrderableDataBuilder().build())
            .build();

        orderQuantity = 50;
        tradeItemLineItems = [
            new TradeItemLineItemDataBuilder().build(),
            new TradeItemLineItemDataBuilder().build()
        ];

        commodityTypeLineItem = new CommodityTypeLineItemDataBuilder()
            .withSummary(summary)
            .withOrderQuantity(orderQuantity)
            .withTradeItemLineItems(tradeItemLineItems)
            .build();
    });

    describe('constructor', function() {

        it('should set isCommodityTypeLineItem flag to true', function() {
            var result = new CommodityTypeLineItem(summary, orderQuantity, tradeItemLineItems);

            expect(result.isCommodityTypeLineItem).toBe(true);
        });

        it('should set product code', function() {
            var result = new CommodityTypeLineItem(summary, orderQuantity, tradeItemLineItems);

            expect(result.productCode).not.toBeUndefined();
            expect(result.productCode).toBe(summary.orderable.productCode);
        });

        it('should set product name', function() {
            var result = new CommodityTypeLineItem(summary, orderQuantity, tradeItemLineItems);

            expect(result.productName).not.toBeUndefined();
            expect(result.productName).toBe(summary.orderable.fullProductName);
        });

        it('should set order quantity', function() {
            var result = new CommodityTypeLineItem(summary, orderQuantity, tradeItemLineItems);

            expect(result.orderQuantity).toEqual(orderQuantity);
        });

        it('should set trade item line items', function() {
            var result = new CommodityTypeLineItem(summary, orderQuantity, tradeItemLineItems);

            expect(result.tradeItemLineItems).toEqual(tradeItemLineItems);
        });
    });

    describe('getAvailableSoh', function() {

        beforeEach(function() {
            spyOn(commodityTypeLineItem.tradeItemLineItems[0], 'getAvailableSoh');
            spyOn(commodityTypeLineItem.tradeItemLineItems[1], 'getAvailableSoh');
        });

        it('should calculate available stock on hand ', function() {
            commodityTypeLineItem.tradeItemLineItems[0].getAvailableSoh.andReturn(10);
            commodityTypeLineItem.tradeItemLineItems[1].getAvailableSoh.andReturn(20);

            var result = commodityTypeLineItem.getAvailableSoh();

            expect(result).toEqual(30);
        });

        it('should pass inDoses flag', function() {
            commodityTypeLineItem.tradeItemLineItems[0].getAvailableSoh.andReturn(10);
            commodityTypeLineItem.tradeItemLineItems[1].getAvailableSoh.andReturn(20);

            var result = commodityTypeLineItem.getAvailableSoh(true);

            expect(result).toEqual(30);
            expect(commodityTypeLineItem.tradeItemLineItems[0].getAvailableSoh)
                .toHaveBeenCalledWith(true);
            expect(commodityTypeLineItem.tradeItemLineItems[1].getAvailableSoh)
                .toHaveBeenCalledWith(true);
        });

    });

    describe('getFillQuantity', function() {

        beforeEach(function() {
            spyOn(commodityTypeLineItem.tradeItemLineItems[0], 'getFillQuantity');
            spyOn(commodityTypeLineItem.tradeItemLineItems[1], 'getFillQuantity');
        });

        it('should calculate fill quantity', function() {
            commodityTypeLineItem.tradeItemLineItems[0].getFillQuantity.andReturn(10);
            commodityTypeLineItem.tradeItemLineItems[1].getFillQuantity.andReturn(20);

            var result = commodityTypeLineItem.getFillQuantity();

            expect(result).toEqual(30);
        });

    });

});