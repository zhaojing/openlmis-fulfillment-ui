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

describe('ShipmentLineItemWithSummary', function() {

    var ShipmentLineItemWithSummary, StockCardSummaryDataBuilder;

    beforeEach(function() {
        module('shipment-view');

        inject(function($injector) {
            ShipmentLineItemWithSummary = $injector.get('ShipmentLineItemWithSummary');
            StockCardSummaryDataBuilder = $injector.get('StockCardSummaryDataBuilder');
        });
    });

    describe('constructor', function() {

        it('should set fields', function() {
            var stockCardSummary = new StockCardSummaryDataBuilder().build(),
                someId = 'some-id',
                result = new ShipmentLineItemWithSummary(someId, stockCardSummary, 0);

            expect(result.id).toEqual(someId);
            expect(result.orderable).toEqual(stockCardSummary.orderable);
            expect(result.lot).toEqual(stockCardSummary.lot);
            expect(result.summary).toEqual(stockCardSummary);
            expect(result.quantityShipped).toEqual(0);
        });

    });

    describe('validate', function() {

        var shipmentLineItem;

        beforeEach(function() {
            shipmentLineItem = new ShipmentLineItemWithSummary(
                undefined,
                new StockCardSummaryDataBuilder().build(),
                0
            );
        });

        it('should return empty object if object is valid', function() {
            shipmentLineItem.validate();

            expect(shipmentLineItem.errors).toEqual({});
        });

        it('should return error if quantityShipped is greater than available SOH', function() {
            shipmentLineItem.summary.stockOnHand = 10;
            shipmentLineItem.quantityShipped = 11;

            shipmentLineItem.validate();

            expect(shipmentLineItem.errors).toEqual({
                quantityShipped: 'shipmentView.fillQuantityCannotExceedStockOnHand'
            });
        });

        it('should not return error if quantityShipped is equal to available SOH', function() {
            shipmentLineItem.summary.stockOnHand = 10;
            shipmentLineItem.quantityShipped = 10;

            shipmentLineItem.validate();

            expect(shipmentLineItem.errors).toEqual({});
        });

        it('should not return error if quantityShipped is lower than available SOH', function() {
            shipmentLineItem.summary.stockOnHand = 10;
            shipmentLineItem.quantityShipped = 9;

            shipmentLineItem.validate();

            expect(shipmentLineItem.errors).toEqual({});
        });

    });

});
