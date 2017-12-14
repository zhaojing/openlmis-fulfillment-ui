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

describe('orderRepository', function() {

    var orderRepository, Order, OrderResponseDataBuilder, OrderDataBuilder, orderFactory,
        orderService, $q, $rootScope, PageDataBuilder, BasicOrder, BasicOrderResponseDataBuilder,
        BasicOrderDataBuilder, basicOrderFactory;

    beforeEach(function() {
        module('order');

        inject(function($injector) {
            orderRepository = $injector.get('orderRepository');
            Order = $injector.get('Order');
            OrderResponseDataBuilder = $injector.get('OrderResponseDataBuilder');
            OrderDataBuilder = $injector.get('OrderDataBuilder');
            orderFactory = $injector.get('orderFactory');
            orderService = $injector.get('orderService');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            PageDataBuilder = $injector.get('PageDataBuilder');
            BasicOrder = $injector.get('BasicOrder');
            BasicOrderDataBuilder = $injector.get('BasicOrderDataBuilder');
            BasicOrderResponseDataBuilder = $injector.get('BasicOrderResponseDataBuilder');
            basicOrderFactory = $injector.get('basicOrderFactory');
        });
    });

    describe('get', function() {

        var order, orderResponse;

        beforeEach(function() {
            order = new OrderDataBuilder().build();
            orderResponse = new OrderResponseDataBuilder().build();

            spyOn(orderFactory, 'buildFromResponse');
            spyOn(orderService, 'get');
        });

        it('should return instance of the Order class', function() {
            orderFactory.buildFromResponse.andReturn(order);
            orderService.get.andReturn($q.resolve(orderResponse));

            var result;
            orderRepository.get(order.id)
            .then(function(order) {
                result = order;
            });
            $rootScope.$apply();

            expect(result instanceof Order).toBe(true);
            expect(result).toEqual(order);
            expect(orderFactory.buildFromResponse).toHaveBeenCalledWith(orderResponse);
            expect(orderService.get).toHaveBeenCalledWith(order.id);
        });

        it('should reject promise if orderFactory throws an error', function() {
            orderService.get.andReturn($q.resolve());
            orderFactory.buildFromResponse.andThrow();

            var rejected;
            orderRepository.get(order.id)
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

        it('should reject promise if orderService promise was rejected', function() {
            orderService.get.andReturn($q.reject());

            var rejected;
            orderRepository.get(order.id)
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

        it('should throw exception if undefined was given as order id', function() {
            expect(function() {
                orderRepository.get();
            }).toThrow('Order ID must be defined');
        });

    });

    describe('search', function() {

        var basicOrders, basicOrderResponses, searchParams;

        beforeEach(function() {
            basicOrders = [
                new BasicOrderDataBuilder().build(),
                new BasicOrderDataBuilder().build()
            ];

            basicOrderResponses = [
                new BasicOrderResponseDataBuilder().build(),
                new BasicOrderResponseDataBuilder().build()
            ];

            searchParams = {
                supplyingFacility: 'some-facility-id'
            };

            spyOn(basicOrderFactory, 'buildFromResponseArray');
            spyOn(orderService, 'search');
        });

        it('should return instances of the BasicOrder class', function() {
            var page = PageDataBuilder.buildWithContent(basicOrderResponses);

            basicOrderFactory.buildFromResponseArray.andReturn(basicOrders);
            orderService.search.andReturn($q.resolve(page));

            var result;
            orderRepository.search(searchParams)
            .then(function(page) {
                result = page;
            });
            $rootScope.$apply();

            expect(result.content.length).toBe(2);
            expect(result.content[0] instanceof BasicOrder).toBe(true);
            expect(result.content[1] instanceof BasicOrder).toBe(true);
            expect(result.content).toEqual(basicOrders);
            expect(basicOrderFactory.buildFromResponseArray).toHaveBeenCalledWith(basicOrderResponses);
            expect(orderService.search).toHaveBeenCalledWith(searchParams);
        });

        it('should resolve if undefined was passed', function() {
            var page = PageDataBuilder.buildWithContent(basicOrderResponses);

            basicOrderFactory.buildFromResponseArray.andReturn(basicOrders);
            orderService.search.andReturn($q.resolve(page));

            var result;
            orderRepository.search(undefined)
            .then(function(page) {
                result = page;
            });
            $rootScope.$apply();

            expect(result).toBeDefined();
        });

        it('should reject promise if basicOrderFactory throws an error', function() {
            orderService.search.andReturn($q.resolve());
            basicOrderFactory.buildFromResponseArray.andThrow();

            var rejected;
            orderRepository.search(searchParams)
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

        it('should reject promise if orderService promise was rejected', function() {
            orderService.search.andReturn($q.reject());

            var rejected;
            orderRepository.search(searchParams)
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

    });

});
