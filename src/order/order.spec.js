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

describe('Order', function() {

    var Order, BasicOrderResponseDataBuilder, ORDER_STATUS, orderResponse, order, result;

    beforeEach(function() {
        module('order');

        inject(function($injector) {
            Order = $injector.get('Order');
            ORDER_STATUS = $injector.get('ORDER_STATUS');
            BasicOrderResponseDataBuilder = $injector.get('BasicOrderResponseDataBuilder');
        });
    });

    describe('constructor', function() {

        it('should set all properties', function() {
            orderResponse = new BasicOrderResponseDataBuilder().build();
            result = new Order(orderResponse);

            expect(result.id).toEqual(orderResponse.id);
            expect(result.emergency).toEqual(orderResponse.emergency);
            expect(result.createdDate).toEqual(orderResponse.createdDate);
            expect(result.lastUpdatedDate).toEqual(orderResponse.lastUpdatedDate);
            expect(result.program).toEqual(orderResponse.program);
            expect(result.requestingFacility).toEqual(orderResponse.requestingFacility);
            expect(result.orderCode).toEqual(orderResponse.orderCode);
            expect(result.status).toEqual(orderResponse.status);
            expect(result.facility).toEqual(orderResponse.facility);
            expect(result.receivingFacility).toEqual(orderResponse.receivingFacility);
            expect(result.supplyingFacility).toEqual(orderResponse.supplyingFacility);
            expect(result.lastUpdater).toEqual(orderResponse.lastUpdater);
            expect(result.processingPeriod.startDate).toEqual(orderResponse.processingPeriod.startDate);
            expect(result.processingPeriod.endDate).toEqual(orderResponse.processingPeriod.endDate);
        });

    });

    describe('isFulfillmentStarted', function() {

        it('should return true if status is FULFILLING', function () {
            orderResponse = new BasicOrderResponseDataBuilder()
                .withStatus(ORDER_STATUS.FULFILLING)
                .build();

            order = new Order(orderResponse);

            expect(order.isFulfillmentStarted())
                .toEqual(true);
        });

        it('should return false if status is different than FULFILLING', function () {
            orderResponse = new BasicOrderResponseDataBuilder()
                .withStatus(ORDER_STATUS.IN_ROUTE)
                .build();

            order = new Order(orderResponse);

            expect(order.isFulfillmentStarted())
                .toEqual(false);
        });
    });

});
