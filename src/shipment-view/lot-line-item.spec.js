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

describe('LotLineItem', function () {

    var LotLineItem, CanFulfillForMeEntryDataBuilder, OrderableDataBuilder, LotLineItemDataBuilder,
        ShipmentLineItemDataBuilder, canFulfillForMe, shipmentLineItem, lotLineItem;

    beforeEach(function () {
        module('shipment-view');

        inject(function ($injector) {
            LotLineItem = $injector.get('LotLineItem');
            CanFulfillForMeEntryDataBuilder = $injector.get('CanFulfillForMeEntryDataBuilder');
            ShipmentLineItemDataBuilder = $injector.get('ShipmentLineItemDataBuilder');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            LotLineItemDataBuilder = $injector.get('LotLineItemDataBuilder');
        });

        canFulfillForMe = new CanFulfillForMeEntryDataBuilder()
            .withStockOnHand(19)
            .withOrderable(
                new OrderableDataBuilder()
                    .withNetContent(5)
                    .buildJson()
            )
            .buildJson();

        shipmentLineItem = new ShipmentLineItemDataBuilder().build();

        lotLineItem = new LotLineItemDataBuilder()
            .withNetContent(5)
            .withAvailableSoh(19)
            .withShipmentLineItem(shipmentLineItem)
            .build();
    });

    describe('constructor', function () {

        it('should set isLotLineItem flag to true', function () {
            var result = new LotLineItem(canFulfillForMe, shipmentLineItem);

            expect(result.isLotLineItem).toBe(true);
        });

        it('should set lot', function() {
            var result = new LotLineItem(canFulfillForMe, shipmentLineItem);

            expect(result.lot).not.toBeUndefined();
            expect(result.lot).toEqual(canFulfillForMe.lot);
        });

        it('should set available stock on hand', function() {
            var result = new LotLineItem(canFulfillForMe, shipmentLineItem);

            expect(result.availableSoh).toEqual(3);
        });

        it('should set shipment line item', function() {
            var result = new LotLineItem(canFulfillForMe, shipmentLineItem);

            expect(result.shipmentLineItem).not.toBeUndefined();
            expect(result.shipmentLineItem).toEqual(shipmentLineItem);
        });

        it('should extend ShipmentViewLineItem', function() {
            var result = new LotLineItem(canFulfillForMe, shipmentLineItem);

            expect(result.netContent).toEqual(canFulfillForMe.orderable.netContent);
        });

    });

    describe('getAvailableSoh', function() {
    
        it('should return quantity in packs by default', function() {
            expect(lotLineItem.getAvailableSoh()).toEqual(3);
        });

        it('should return quantity in doses if flag is set to true', function() {
            expect(lotLineItem.getAvailableSoh(true)).toEqual(15);
        });
    
    });

    describe('getFillQuantity', function() {
    
        it('should return quantity shipped', function() {
            var result = lotLineItem.getFillQuantity();

            expect(result).not.toBeUndefined();
            expect(result).toEqual(shipmentLineItem.quantityShipped);
        });
    
    });

});