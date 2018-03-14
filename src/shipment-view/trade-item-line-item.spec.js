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

describe('TradeItemLineItem', function() {

    var TradeItemLineItem, TradeItemLineItemDataBuilder, OrderableDataBuilder,
        LotLineItemDataBuilder, orderable, lotLineItems, tradeItemLineItem,
        ShipmentLineItemDataBuilder;

    beforeEach(function() {
        module('shipment-view');

        inject(function($injector) {
            TradeItemLineItem = $injector.get('TradeItemLineItem');
            TradeItemLineItemDataBuilder = $injector.get('TradeItemLineItemDataBuilder');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            LotLineItemDataBuilder = $injector.get('LotLineItemDataBuilder');
        });

        orderable = new OrderableDataBuilder().buildJson();
        lotLineItems = [
            new LotLineItemDataBuilder().build(),
            new LotLineItemDataBuilder().build()
        ];

        tradeItemLineItem = new TradeItemLineItemDataBuilder()
            .withLotLineItems(lotLineItems)
            .build();
    });

    describe('constructor', function() {
    
        it('should set product name', function() {
            var result = new TradeItemLineItem(orderable, lotLineItems);

            expect(result.productName).not.toBeUndefined();
            expect(result.productName).toEqual(orderable.fullProductName);
        });

        it('should set produce code', function() {
            var result = new TradeItemLineItem(orderable, lotLineItems);

            expect(result.productCode).not.toBeUndefined();
            expect(result.productCode).toEqual(orderable.productCode);
        });

        it('should set lot line items', function() {
            var result = new TradeItemLineItem(orderable, lotLineItems);

            expect(result.lotLineItems).not.toBeUndefined();
            expect(result.lotLineItems).toEqual(lotLineItems);
        });

        it('should extend ShipmentViewLineItem', function() {
            var result = new TradeItemLineItem(orderable, lotLineItems);

            expect(result.netContent).not.toBeUndefined();
            expect(result.netContent).toEqual(orderable.netContent);
        });
    
    });

    describe('getAvailableSoh', function() {

        beforeEach(function() {
            spyOn(lotLineItems[0], 'getAvailableSoh');
            spyOn(lotLineItems[1], 'getAvailableSoh');
        });
    
        it('should return quantity in packs by default', function() {
            lotLineItems[0].getAvailableSoh.andReturn(1);
            lotLineItems[1].getAvailableSoh.andReturn(3);

            var result = tradeItemLineItem.getAvailableSoh();

            expect(result).toEqual(4);
        });

        it('should return in doses if flag is set', function() {
            lotLineItems[0].getAvailableSoh.andReturn(4);
            lotLineItems[1].getAvailableSoh.andReturn(12);

            var result = tradeItemLineItem.getAvailableSoh(true);

            expect(result).toEqual(16);
            expect(lotLineItems[0].getAvailableSoh).toHaveBeenCalledWith(true);
            expect(lotLineItems[1].getAvailableSoh).toHaveBeenCalledWith(true);
        });
    
    });

    describe('getFillQuantity', function() {
    
        it('should return quantity in packs by default', function() {
            spyOn(lotLineItems[0], 'getFillQuantity').andReturn(3);
            spyOn(lotLineItems[1], 'getFillQuantity').andReturn(6);

            var result = tradeItemLineItem.getFillQuantity();

            expect(result).toEqual(9);
        });
    
    });

});