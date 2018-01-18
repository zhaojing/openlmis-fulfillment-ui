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

describe('orderRepository decorator', function() {

    var orderRepository, orderServiceMock, ORDER_STATUS;

    beforeEach(function() {
        module('proof-of-delivery-manage', function($provide) {
            orderServiceMock = createMock($provide, 'orderService', ['search']);
        });

        inject(function($injector) {
            ORDER_STATUS = $injector.get('ORDER_STATUS');
            orderRepository = $injector.get('orderRepository');
        });
    });

    describe('searchOrdersForManagePod', function() {
        it('should call orderService with id param', function() {
            orderServiceMock.search.andReturn($q.when());
            var searchParams = {
                requestingFacility: 'id-one',
                program: 'id-two'
            };
            orderRepository.searchOrdersForManagePod(searchParams);

            expect(orderServiceMock.search).toHaveBeenCalledWith({
                requestingFacility: 'id-one',
                program: 'id-two',
                status: [
                    ORDER_STATUS.TRANSFER_FAILED,
                    ORDER_STATUS.READY_TO_PACK,
                    ORDER_STATUS.ORDERED,
                    ORDER_STATUS.RECEIVED,
                    ORDER_STATUS.IN_ROUTE
                ]
            });
        });
    });

});

function createMock($provide, name, methods) {
    var mock = jasmine.createSpyObj(name, methods);
    $provide.factory(name, function() {
        return mock;
    });
    return mock;
}
