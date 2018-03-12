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

describe('ShipmentViewLineItem', function() {

    var shipmentViewLineItem, ShipmentViewLineItem, OrderableDataBuilder, orderable;

    beforeEach(function() {
        module('shipment-view');

        inject(function($injector) {
            ShipmentViewLineItem = $injector.get('ShipmentViewLineItem');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
        });

        orderable = new OrderableDataBuilder()
            .withNetContent(5)
            .buildJson();

        shipmentViewLineItem = new ShipmentViewLineItem(orderable);
    });

    describe('constructor', function() {
    
        it('should set net content', function() {
            var result = new ShipmentViewLineItem(orderable);

            expect(result.netContent).toEqual(orderable.netContent);
        });
    
    });

    describe('getAvailableSoh', function() {
    
        it('should throw exception', function() {
            expect(function() {
                shipmentViewLineItem.getAvailableSoh();
            }).toThrow('Method is not supported');
        });
    
    });

    describe('getFilledQuantity', function() {
    
        it('should throw exception', function () {
            expect(function () {
                shipmentViewLineItem.getFillQuantity();
            }).toThrow('Method is not supported');
        });
    
    });

    describe('getRemainingQuantity', function() {

        beforeEach(function() {
            spyOn(shipmentViewLineItem, 'getAvailableSoh');
            spyOn(shipmentViewLineItem, 'getFillQuantity');
        });
    
        it('should return quantity in packs by default', function() {
            shipmentViewLineItem.getAvailableSoh.andReturn(160);
            shipmentViewLineItem.getFillQuantity.andReturn(33);

            var result = shipmentViewLineItem.getRemainingQuantity();

            expect(result).toEqual(127);
        });

        it('should return quantity in doses if flag is set', function() {
            shipmentViewLineItem.getAvailableSoh.andReturn(20);
            shipmentViewLineItem.getFillQuantity.andReturn(5);

            var result = shipmentViewLineItem.getRemainingQuantity(true);

            expect(result).toEqual(75);
        });
    
    });

});