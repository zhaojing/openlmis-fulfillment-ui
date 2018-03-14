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

describe('ShipmentLineItem', function() {

    var ShipmentLineItem, ShipmentLineItemDataBuilder, json, CanFulfillForMeEntryDataBuilder,
        OrderableDataBuilder;

    beforeEach(function() {
        module('stock-card-summary');
        module('shipment');

        inject(function($injector) {
            ShipmentLineItem = $injector.get('ShipmentLineItem');
            ShipmentLineItemDataBuilder = $injector.get('ShipmentLineItemDataBuilder');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            CanFulfillForMeEntryDataBuilder = $injector.get('CanFulfillForMeEntryDataBuilder');
        });

        json = new ShipmentLineItemDataBuilder().buildJson();
    });

    describe('constructor', function() {

        it('should set id', function() {
            var result = new ShipmentLineItem(json);

            expect(result.id).toEqual(json.id);
        });

        it('should set orderable', function() {
            var result = new ShipmentLineItem(json);

            expect(result.orderable).toEqual(json.orderable);
        });

        it('should set lot', function() {
            var result = new ShipmentLineItem(json);

            expect(result.lot).toEqual(json.lot);
        });

        it('should set quantity shipped', function() {
            var result = new ShipmentLineItem(json);

            expect(result.quantityShipped).toEqual(json.quantityShipped);
        });

        it('should set stock on hand in packs', function() {
            json = new ShipmentLineItemDataBuilder()
                .withQuantityShipped(20)
                .withCanFulfillForMe(
                    new CanFulfillForMeEntryDataBuilder()
                    .withOrderable(new OrderableDataBuilder()
                        .withNetContent(6)
                        .buildJson()
                    )
                    .withStockOnHand(45)
                    .buildJson()
                )
                .buildJson();

            var result = new ShipmentLineItem(json);

            expect(result.stockOnHand).toEqual(7);
        });

    });

    describe('validate', function() {

        var shipmentLineItem;

        beforeEach(function() {
            shipmentLineItem = new ShipmentLineItemDataBuilder()
                .withQuantityShipped(5)
                .withCanFulfillForMe(
                    new CanFulfillForMeEntryDataBuilder()
                        .withOrderable(new OrderableDataBuilder()
                            .withNetContent(6)
                            .buildJson()
                        )
                        .withStockOnHand(45)
                        .buildJson()
                )
                .build();
        });

        it('should return undefined if line item is valid', function() {
            var result = shipmentLineItem.validate();

            expect(result).toBeUndefined();
        });

        it('should return error if quantity shipped is undefined', function() {
            shipmentLineItem.quantityShipped = undefined;

            var result = shipmentLineItem.validate();

            expect(result).toEqual({
                quantityShipped: 'shipment.required'
            });
        });

        it('should return error if quantity shipped is greater than stock on hand', function() {
            shipmentLineItem.quantityShipped = 46;

            var result = shipmentLineItem.validate();

            expect(result).toEqual({
                quantityShipped: 'shipment.fillQuantityCannotExceedStockOnHand'
            });
        });

        it('should return undefined if quantity shipped is 0', function() {
            shipmentLineItem.quantityShipped = 0;

            var result = shipmentLineItem.validate();

            expect(result).toBeUndefined();
        });

    });

});