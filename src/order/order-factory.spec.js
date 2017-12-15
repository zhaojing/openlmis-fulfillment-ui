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

describe('orderFactory', function() {

    var orderFactory, OrderResponseDataBuilder;

    beforeEach(function() {
        module('order');

        inject(function($injector) {
            orderFactory = $injector.get('orderFactory');
            OrderResponseDataBuilder = $injector.get('OrderResponseDataBuilder');
        });
    });

    describe('buildFromResponse', function() {

        var response;

        beforeEach(function() {
            response = new OrderResponseDataBuilder().build();
        });

        it('should set id', function() {
            var result = orderFactory.buildFromResponse(response);

            expect(result.id).toEqual(response.id);
        });

        it('should set emergency', function() {
            var result = orderFactory.buildFromResponse(response);

            expect(result.emergency).toEqual(response.emergency);
        });

        it('should set parsed createdDate ', function() {
            var result = orderFactory.buildFromResponse(response);

            expect(result.createdDate).toEqual(new Date(response.createdDate));
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
            var result = orderFactory.buildFromResponse(response)

            expect(result.status).toEqual(response.status);
        });

        it('should throw exception if processingPeriod is undefined', function() {
            response = new OrderResponseDataBuilder()
                .withProcessingPeriod(undefined);

            expect(function() {
                return orderFactory.buildFromResponse(response);
            }).toThrow();
        });

        it('should set processingPeriod', function() {
            var processingPeriod = angular.copy(response.processingPeriod);

            processingPeriod.startDate = new Date(processingPeriod.startDate);
            processingPeriod.endDate = new Date(processingPeriod.endDate);

            var result = orderFactory.buildFromResponse(response);

            expect(result.processingPeriod).toEqual(processingPeriod);
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
