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

describe('BasicOrderFactory', function() {

    var BasicOrder, BasicOrderFactory, BasicOrderResponseDataBuilder, PeriodDataBuilder;

    beforeEach(function() {
        module('order');

        inject(function($injector) {
            BasicOrder = $injector.get('BasicOrder');
            PeriodDataBuilder = $injector.get('PeriodDataBuilder');
            BasicOrderFactory = $injector.get('BasicOrderFactory');
            BasicOrderResponseDataBuilder = $injector.get('BasicOrderResponseDataBuilder');
        });
    });

    describe('buildFromResponse', function() {

        var response, basicOrderFactory;

        beforeEach(function() {
            response = new BasicOrderResponseDataBuilder().build();
            basicOrderFactory = new BasicOrderFactory();
        });

        it('should return instance of the BasicOrder class', function() {
            expect(basicOrderFactory.buildFromResponse(response) instanceof BasicOrder).toBe(true);
        });

        it('should set id', function() {
            var result = basicOrderFactory.buildFromResponse(response);

            expect(result.id).toEqual(response.id);
        });

        it('should set emergency', function() {
            var result = basicOrderFactory.buildFromResponse(response);

            expect(result.emergency).toEqual(response.emergency);
        });

        it('should throw exception if createdDate is undefined', function() {
            response = new BasicOrderResponseDataBuilder()
                .withCreatedDate(undefined);

            expect(function() {
                return basicOrderFactory.buildFromResponse(response);
            }).toThrow('createdDate must be defined');
        });

        it('should set parsed createdDate ', function() {
            var result = basicOrderFactory.buildFromResponse(response);

            expect(result.createdDate).toEqual(new Date(response.createdDate));
        });

        it('should throw exception if lastUpdatedDate is undefined', function() {
            response = new BasicOrderResponseDataBuilder()
                .withLastUpdatedDate(undefined);

            expect(function() {
                return basicOrderFactory.buildFromResponse(response);
            }).toThrow('lastUpdatedDate must be defined');
        });

        it('should set parsed lastUpdatedDate', function() {
            var result = basicOrderFactory.buildFromResponse(response);

            expect(result.lastUpdatedDate).toEqual(new Date(response.lastUpdatedDate));
        });

        it('should set program', function() {
            var result = basicOrderFactory.buildFromResponse(response);

            expect(result.program).toEqual(response.program);
        });

        it('should set requestingFacility', function() {
            var result = basicOrderFactory.buildFromResponse(response);

            expect(result.requestingFacility).toEqual(response.requestingFacility);
        });

        it('should set orderCode', function() {
            var result = basicOrderFactory.buildFromResponse(response);

            expect(result.orderCode).toEqual(response.orderCode);
        });

        it('should set status', function() {
            var result = basicOrderFactory.buildFromResponse(response);

            expect(result.status).toEqual(response.status);
        });

        it('should throw exception if processingPeriod is undefined', function() {
            response = new BasicOrderResponseDataBuilder()
                .withProcessingPeriod(undefined);

            expect(function() {
                return basicOrderFactory.buildFromResponse(response);
            }).toThrow('processingPeriod must be defined');
        });

        it('should set processingPeriod', function() {
            var processingPeriod = angular.copy(response.processingPeriod);

            processingPeriod.startDate = new Date(processingPeriod.startDate);
            processingPeriod.endDate = new Date(processingPeriod.endDate);

            var result = basicOrderFactory.buildFromResponse(response);

            expect(result.processingPeriod).toEqual(processingPeriod);
        });

        it('should throw exception if processingPeriod.startDate is undefined', function() {
            var processingPeriod = PeriodDataBuilder.buildWithoutStartDate();

            response = new BasicOrderResponseDataBuilder()
                .withProcessingPeriod(processingPeriod)
                .build();

            expect(function() {
                return basicOrderFactory.buildFromResponse(response);
            }).toThrow('startDate must be defined');
        });

        it('should throw exception if processingPeriod.end date is undefined', function() {
            var processingPeriod = PeriodDataBuilder.buildWithoutEndDate();

            response = new BasicOrderResponseDataBuilder()
                .withProcessingPeriod(processingPeriod)
                .build();

            expect(function() {
                return basicOrderFactory.buildFromResponse(response);
            }).toThrow('endDate must be defined');
        });

        it('should set parsed processingPeriod.startDate', function() {
            var result = basicOrderFactory.buildFromResponse(response);

            expect(result.lastUpdatedDate).toEqual(new Date(response.processingPeriod.startDate));
        });

        it('should set parsed processingPeriod.endDate', function() {
            var result = basicOrderFactory.buildFromResponse(response);

            expect(result.lastUpdatedDate).toEqual(new Date(response.processingPeriod.endDate));
        });

        it('should set facility', function() {
            var result = basicOrderFactory.buildFromResponse(response);

            expect(result.facility).toEqual(response.facility);
        });

        it('should set receivingFacility', function() {
            var result = basicOrderFactory.buildFromResponse(response);

            expect(result.receivingFacility).toEqual(response.receivingFacility);
        });

        it('should set supplyingFacility', function() {
            var result = basicOrderFactory.buildFromResponse(response);

            expect(result.supplyingFacility).toEqual(response.supplyingFacility);
        });

        it('should set lastUpdater', function() {
            var result = basicOrderFactory.buildFromResponse(response);

            expect(result.lastUpdater).toEqual(response.lastUpdater);
        });

    });

});
