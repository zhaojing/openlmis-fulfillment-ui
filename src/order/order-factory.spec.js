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

describe('OrderFactory', function() {

    var Order, OrderFactory, OrderLineItemFactory, OrderResponseDataBuilder,
        OrderLineItem, OrderLineItemDataBuilder, PeriodDataBuilder;

    beforeEach(function() {
        module('order');

        inject(function($injector) {
            Order = $injector.get('Order');
            OrderLineItem = $injector.get('OrderLineItem');
            OrderLineItemDataBuilder = $injector.get('OrderLineItemDataBuilder');
            PeriodDataBuilder = $injector.get('PeriodDataBuilder');
            OrderFactory = $injector.get('OrderFactory');
            OrderLineItemFactory = $injector.get('OrderLineItemFactory');
            OrderResponseDataBuilder = $injector.get('OrderResponseDataBuilder');
        });
    });

    describe('constructor', function() {

        var orderLineItemFactory;

        beforeEach(function() {
            orderLineItemFactory = new OrderLineItemFactory();
        });

        it('should set orderLineItemFactory', function() {
            var result = new OrderFactory(orderLineItemFactory);

            expect(result.orderLineItemFactory).toBe(orderLineItemFactory);
        });

        it('should throw exception if orderLineItemFactory is not given', function() {
            expect(function() {
                return new OrderFactory();
            }).toThrow('An instance of orderLineItemFactory must be provided');
        });

        it('should throw exception if given object is not an instance of OrderLineItemFactory class', function() {
            expect(function() {
                return new OrderFactory({});
            }).toThrow('An instance of orderLineItemFactory must be provided');
        });

    });

    describe('buildFromResponse', function() {

        var response, orderFactory, orderLineItemFactory;

        beforeEach(function() {
            response = new OrderResponseDataBuilder().build();
            orderLineItemFactory = new OrderLineItemFactory();
            orderFactory = new OrderFactory(orderLineItemFactory);

            spyOn(orderLineItemFactory, 'buildFromResponseArray');
        });

        it('should return instance of the Order class', function() {
            expect(orderFactory.buildFromResponse(response) instanceof Order).toBe(true);
        });

        it('should return instances of the OrderLineItem class as orderLineItems', function() {
            orderLineItemFactory.buildFromResponseArray.andReturn([
                new OrderLineItemDataBuilder().build(),
                new OrderLineItemDataBuilder().build()
            ]);

            var result = orderFactory.buildFromResponse(response);

            expect(result.orderLineItems.length).toBe(2);
            expect(result.orderLineItems[0] instanceof OrderLineItem).toBe(true);
            expect(result.orderLineItems[1] instanceof OrderLineItem).toBe(true);
            expect(orderLineItemFactory.buildFromResponseArray)
                .toHaveBeenCalledWith(response.orderLineItems);
        });

        it('should set id', function() {
            var result = orderFactory.buildFromResponse(response);

            expect(result.id).toEqual(response.id);
        });

        it('should set emergency', function() {
            var result = orderFactory.buildFromResponse(response);

            expect(result.emergency).toEqual(response.emergency);
        });

        it('should throw exception if createdDate is undefined', function() {
            response = new OrderResponseDataBuilder()
                .withCreatedDate(undefined);

            expect(function() {
                return orderFactory.buildFromResponse(response);
            }).toThrow('createdDate must be defined');
        });

        it('should set parsed createdDate ', function() {
            var result = orderFactory.buildFromResponse(response);

            expect(result.createdDate).toEqual(new Date(response.createdDate));
        });

        it('should throw exception if lastUpdatedDate is undefined', function() {
            response = new OrderResponseDataBuilder()
                .withLastUpdatedDate(undefined);

            expect(function() {
                return orderFactory.buildFromResponse(response);
            }).toThrow('lastUpdatedDate must be defined');
        });

        it('should set parsed lastUpdatedDate', function() {
            var result = orderFactory.buildFromResponse(response);

            expect(result.lastUpdatedDate).toEqual(new Date(response.lastUpdatedDate));
        });

        it('should set program', function() {
            var result = orderFactory.buildFromResponse(response);

            expect(result.program).toEqual(response.program);
        });

        it('should set requestingFacility', function() {
            var result = orderFactory.buildFromResponse(response);

            expect(result.requestingFacility).toEqual(response.requestingFacility);
        });

        it('should set orderCode', function() {
            var result = orderFactory.buildFromResponse(response);

            expect(result.orderCode).toEqual(response.orderCode);
        });

        it('should set status', function() {
            var result = orderFactory.buildFromResponse(response);

            expect(result.status).toEqual(response.status);
        });

        it('should throw exception if processingPeriod is undefined', function() {
            response = new OrderResponseDataBuilder()
                .withProcessingPeriod(undefined);

            expect(function() {
                return orderFactory.buildFromResponse(response);
            }).toThrow('processingPeriod must be defined');
        });

        it('should set processingPeriod', function() {
            var processingPeriod = angular.copy(response.processingPeriod);

            processingPeriod.startDate = new Date(processingPeriod.startDate);
            processingPeriod.endDate = new Date(processingPeriod.endDate);

            var result = orderFactory.buildFromResponse(response);

            expect(result.processingPeriod).toEqual(processingPeriod);
        });

        it('should throw exception if processingPeriod.startDate is undefined', function() {
            var processingPeriod = PeriodDataBuilder.buildWithoutStartDate();

            response = new OrderResponseDataBuilder()
                .withProcessingPeriod(processingPeriod)
                .build();

            expect(function() {
                return orderFactory.buildFromResponse(response);
            }).toThrow('startDate must be defined');
        });

        it('should throw exception if processingPeriod.end date is undefined', function() {
            var processingPeriod = PeriodDataBuilder.buildWithoutEndDate();

            response = new OrderResponseDataBuilder()
                .withProcessingPeriod(processingPeriod)
                .build();

            expect(function() {
                return orderFactory.buildFromResponse(response);
            }).toThrow('endDate must be defined');
        });

        it('should set parsed processingPeriod.startDate', function() {
            var result = orderFactory.buildFromResponse(response);

            expect(result.lastUpdatedDate).toEqual(new Date(response.processingPeriod.startDate));
        });

        it('should set parsed processingPeriod.endDate', function() {
            var result = orderFactory.buildFromResponse(response);

            expect(result.lastUpdatedDate).toEqual(new Date(response.processingPeriod.endDate));
        });

        it('should set facility', function() {
            var result = orderFactory.buildFromResponse(response);

            expect(result.facility).toEqual(response.facility);
        });

        it('should set receivingFacility', function() {
            var result = orderFactory.buildFromResponse(response);

            expect(result.receivingFacility).toEqual(response.receivingFacility);
        });

        it('should set supplyingFacility', function() {
            var result = orderFactory.buildFromResponse(response);

            expect(result.supplyingFacility).toEqual(response.supplyingFacility);
        });

        it('should set lastUpdater', function() {
            var result = orderFactory.buildFromResponse(response);

            expect(result.lastUpdater).toEqual(response.lastUpdater);
        });

    });

});
