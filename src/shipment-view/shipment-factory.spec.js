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

describe('ShipmentFactory', function() {

    var shipmentFactory, ShipmentFactory, stockCardRepositoryImplMock, $q, $rootScope,
        OrderDataBuilder, order, StockCardSummaryDataBuilder, CanFulfillForMeEntryDataBuilder,
        stockCardSummaries;

    beforeEach(function() {
        module('shipment-view', function($provide) {
            stockCardRepositoryImplMock = jasmine.createSpyObj('stockCardRepositoryImpl', [
                'query'
            ]);
            $provide.factory('StockCardSummaryRepositoryImpl', function() {
                return function() {
                    return stockCardRepositoryImplMock;
                };
            });
        });

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            ShipmentFactory = $injector.get('ShipmentFactory');
            OrderDataBuilder = $injector.get('OrderDataBuilder');
            StockCardSummaryDataBuilder = $injector.get('StockCardSummaryDataBuilder');
            CanFulfillForMeEntryDataBuilder = $injector.get('CanFulfillForMeEntryDataBuilder');
        });

        shipmentFactory = new ShipmentFactory();

        order = new OrderDataBuilder().build();

        stockCardSummaries = [
            new StockCardSummaryDataBuilder()
                .withCanFulfillForMe([
                    new CanFulfillForMeEntryDataBuilder().buildJson(),
                    new CanFulfillForMeEntryDataBuilder().buildJson()
                ])
                .build(),
            new StockCardSummaryDataBuilder()
                .withCanFulfillForMe([
                    new CanFulfillForMeEntryDataBuilder().buildJson(),
                    new CanFulfillForMeEntryDataBuilder().buildJson()
                ])
                .build()
        ];
    });

    describe('buildFromOrder', function() {
    
        it('should reject if stock card summary repository reject', function() {
            stockCardRepositoryImplMock.query.andReturn($q.reject());

            var rejected;
            shipmentFactory.buildFromOrder(order)
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toEqual(true);
        });

        it('should fetch stock card summaries for all line items', function() {
            stockCardRepositoryImplMock.query.andReturn($q.resolve());

            shipmentFactory.buildFromOrder(order);

            expect(stockCardRepositoryImplMock.query).toHaveBeenCalledWith({
                programId: order.program.id,
                facilityId: order.supplyingFacility.id,
                orderableId: [
                    order.orderLineItems[0].orderable.id,
                    order.orderLineItems[1].orderable.id
                ]
            });
        });

        it('should create shipment with line items for each canFulfillForMe', function() {
            stockCardRepositoryImplMock.query.andReturn($q.resolve({
                content: stockCardSummaries
            }));

            var result;
            shipmentFactory.buildFromOrder(order)
            .then(function(response) {
                result = response;
            });
            $rootScope.$apply();

            expect(result.order).toEqual(order);
            expect(result.lineItems[0]).toEqual({
                orderable: stockCardSummaries[0].canFulfillForMe[0].orderable,
                lot: stockCardSummaries[0].canFulfillForMe[0].lot,
                quantityShipped: 0
            });
            expect(result.lineItems[1]).toEqual({
                orderable: stockCardSummaries[0].canFulfillForMe[1].orderable,
                lot: stockCardSummaries[0].canFulfillForMe[1].lot,
                quantityShipped: 0
            });
            expect(result.lineItems[2]).toEqual({
                orderable: stockCardSummaries[1].canFulfillForMe[0].orderable,
                lot: stockCardSummaries[1].canFulfillForMe[0].lot,
                quantityShipped: 0
            });
            expect(result.lineItems[3]).toEqual({
                orderable: stockCardSummaries[1].canFulfillForMe[1].orderable,
                lot: stockCardSummaries[1].canFulfillForMe[1].lot,
                quantityShipped: 0
            });
        });
    
    });

});