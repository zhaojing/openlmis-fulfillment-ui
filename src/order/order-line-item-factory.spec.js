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

describe('OrderLineItemFactory', function() {

    var OrderLineItemFactory, OrderLineItem, OrderableDataBuilder;

    beforeEach(function() {
        module('order');

        inject(function($injector) {
            OrderLineItemFactory = $injector.get('OrderLineItemFactory');
            OrderLineItem = $injector.get('OrderLineItem');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
        });
    });

    describe('buildFromResponse', function() {

        var orderLineItemFactory;

        beforeEach(function() {
            orderLineItemFactory = new OrderLineItemFactory();
        });

        it('should omit extra fields', function() {
            var response = {
                someExtra: 'field'
            };

            var result = orderLineItemFactory.buildFromResponse(response);

            expect(result.someExtra).toBeUndefined();
        });

        it('should return undefined for undefined', function() {
            expect(orderLineItemFactory.buildFromResponse(undefined)).toBeUndefined();
        });

        it('should set id', function() {
            var id = 'some-id';

            var result = orderLineItemFactory.buildFromResponse({
                id: id
            });

            expect(result.id).toEqual(id);
        });

        it('should set filledQuantity', function() {
            var filledQuantity = 50;

            var result = orderLineItemFactory.buildFromResponse({
                filledQuantity: filledQuantity
            });

            expect(result.filledQuantity).toEqual(filledQuantity);

        });

        it('should set orderedQuantity', function() {
            var orderable = new OrderableDataBuilder().build();

            var result = orderLineItemFactory.buildFromResponse({
                orderable: orderable
            });

            expect(result.orderable).toEqual(orderable);
        });

        it('should set orderedQuantity', function() {
            var orderedQuantity = 40;

            var result = orderLineItemFactory.buildFromResponse({
                orderedQuantity: orderedQuantity
            });

            expect(result.orderedQuantity).toEqual(orderedQuantity);

        });

        it('should set packsToShip', function() {
            var packsToShip = 34;

            var result = orderLineItemFactory.buildFromResponse({
                packsToShip: packsToShip
            });

            expect(result.packsToShip).toEqual(packsToShip);

        });

        it('should return an instance of the OrderLineItem class', function() {
            expect(orderLineItemFactory.buildFromResponse({}) instanceof OrderLineItem).toBe(true);
        });

    });

});
