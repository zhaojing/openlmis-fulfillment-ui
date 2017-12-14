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

describe('orderService', function() {

    var orderService, $rootScope, $httpBackend, fulfillmentUrlFactory, orders, dateUtilsMock,
        OrderDataBuilder, PeriodDataBuilder, orderOne;

    beforeEach(function() {
        module('order', function($provide) {
            dateUtilsMock = jasmine.createSpyObj('dateUtils', ['toDate']);

            $provide.factory('dateUtils', function() {
                return dateUtilsMock;
            });

            dateUtilsMock.toDate.andCallFake(function(array) {
                return new Date(array[0], array[1] - 1, array[2]);
            });
        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $httpBackend = $injector.get('$httpBackend');
            orderService = $injector.get('orderService');
            fulfillmentUrlFactory = $injector.get('fulfillmentUrlFactory');
            OrderDataBuilder = $injector.get('OrderDataBuilder');
            PeriodDataBuilder = $injector.get('PeriodDataBuilder');
        });

        var periodOne = new PeriodDataBuilder()
                        .withStartDate([2017, 2, 1])
                        .withEndDate([2017, 2, 27])
                        .build();

        var periodTwo = new PeriodDataBuilder()
                        .withStartDate([2017, 1, 1])
                        .withEndDate([2017, 1, 31])
                        .build();

        orderOne = new OrderDataBuilder()
                        .withId('id-one')
                        .withProcessingPeriod(periodTwo)
                        .withLastUpdatedDate([2017, 1, 1])
                        .withCreatedDate([2017, 1, 1])
                        .build();

        var orderTwo = new OrderDataBuilder()
                        .withId('id-two')
                        .withProcessingPeriod(periodOne)
                        .withLastUpdatedDate([2017, 11, 1])
                        .withCreatedDate([2017, 2, 1])
                        .build();

        orders = [orderOne, orderTwo];

        $httpBackend.when('GET', fulfillmentUrlFactory('/api/orders/search?supplyingFacility=some-id'))
            .respond(200, {content: orders});

        $httpBackend.when('GET', fulfillmentUrlFactory('/api/orders/some-id'))
            .respond(200, orderOne);
    });

    it('search should return transformed orders', function() {
        var result;

        orderService.search({
            supplyingFacility: 'some-id'
        }).then(function(orders) {
            result = orders;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result.content[0].id).toEqual('id-one');
        expect(result.content[0].processingPeriod.startDate).toEqual(new Date(2017, 0, 1));
        expect(result.content[0].processingPeriod.endDate).toEqual(new Date(2017, 0, 31));
        expect(result.content[0].createdDate).toEqual(new Date(2017, 0, 1));
        expect(result.content[0].lastUpdatedDate).toEqual(new Date(2017, 0, 1));

        expect(result.content[1].id).toEqual('id-two');
        expect(result.content[1].processingPeriod.startDate).toEqual(new Date(2017, 1, 1));
        expect(result.content[1].processingPeriod.endDate).toEqual(new Date(2017, 1, 27));
        expect(result.content[1].createdDate).toEqual(new Date(2017, 1, 1));
        expect(result.content[1].lastUpdatedDate).toEqual(new Date(2017, 10, 1));
    });

    it('get should return transformed order', function() {
        var result;
        orderService.get('some-id').then(function(order) {
            result = order;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result.id).toEqual('id-one');
        expect(result.processingPeriod.startDate).toEqual(new Date(2017, 0, 1));
        expect(result.processingPeriod.endDate).toEqual(new Date(2017, 0, 31));
        expect(result.createdDate).toEqual(new Date(2017, 0, 1));
        expect(result.lastUpdatedDate).toEqual(new Date(2017, 0, 1));
        expect(result.emergency).toEqual(orderOne.emergency);
        expect(result.program).toEqual(orderOne.program);
        expect(result.requestingFacility).toEqual(orderOne.requestingFacility);
        expect(result.orderCode).toEqual(orderOne.orderCode);
        expect(result.status).toEqual(orderOne.status);
        expect(result.orderLineItems).toEqual(orderOne.orderLineItems);
        expect(result.facility).toEqual(orderOne.facility);
        expect(result.receivingFacility).toEqual(orderOne.receivingFacility);
        expect(result.supplyingFacility).toEqual(orderOne.supplyingFacility);
        expect(result.lastUpdaterId).toEqual(orderOne.lastUpdaterId);
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
