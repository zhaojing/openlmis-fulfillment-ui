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

describe('Shipment', function() {

    var Shipment, ShipmentDataBuilder, response, shipment, result;

    beforeEach(function() {
        module('shipment');

        inject(function($injector) {
            Shipment = $injector.get('Shipment');
            ShipmentDataBuilder = $injector.get('ShipmentDataBuilder');
        });
    });

    describe('constructor', function() {

        it('should set all properties', function() {
            response = new ShipmentDataBuilder().build();
            result = new Shipment(response);

            expect(result.id).toEqual(response.id);
            expect(result.notes).toEqual(response.notes);
            expect(result.order).toEqual(response.order);
            expect(result.lineItems).toEqual(response.lineItems);
        });

    });

    describe('canBeConfirmed', function() {

        it('should return true if shipment has at least one line item', function () {
            response = new ShipmentDataBuilder()
                .build();

            shipment = new Shipment(response);

            expect(shipment.canBeConfirmed())
                .toEqual(true);
        });

        it('should return false if shipment does not have any line items', function () {
            response = new ShipmentDataBuilder()
                .buildWithoutLineItems();

            shipment = new Shipment(response);

            expect(shipment.canBeConfirmed())
                .toEqual(false);
        });
    });

});
