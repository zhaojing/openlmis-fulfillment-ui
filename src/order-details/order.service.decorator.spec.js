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

describe('orderService decorator', function() {

    var orderService, $httpBackend, fulfillmentUrlFactory, OrderResponseDataBuilder, $rootScope;

    beforeEach(function() {
        module('order-details');

        inject(function($injector) {
            orderService = $injector.get('orderService');
            $httpBackend = $injector.get('$httpBackend');
            fulfillmentUrlFactory = $injector.get('fulfillmentUrlFactory');
            OrderResponseDataBuilder = $injector.get('OrderResponseDataBuilder');
            $rootScope = $injector.get('$rootScope');
        });
    });

    describe('getWithLastUpdater', function() {

        var order;

        beforeEach(function() {
            order = new OrderResponseDataBuilder().build();

            $httpBackend
            .whenGET(fulfillmentUrlFactory('/api/orders/' + order.id + '?expand=lastUpdater'))
            .respond(200, order);
        });

        it('should add expands=lastUpdater to the URL', function() {
            $httpBackend
            .expectGET(fulfillmentUrlFactory('/api/orders/' + order.id + '?expand=lastUpdater'));

            orderService.getWithLastUpdater(order.id);

            $httpBackend.flush();
        });

        it('should return order', function() {
            var result;
            orderService.getWithLastUpdater(order.id)
            .then(function(order) {
                result = order;
            });
            $rootScope.$apply();
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(order));
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
