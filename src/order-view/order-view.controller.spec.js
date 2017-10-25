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

describe('OrderViewController', function() {

    var vm, $rootScope, loadingModalServiceMock, fulfillmentUrlFactoryMock, supplyingFacilities,
        requestingFacilities, programs, orders, item, $controller, $stateParams, $rootScope, scope,
        requestingFacilityFactory;

    beforeEach(function() {
        module('order-view');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $stateParams = $injector.get('$stateParams');
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            scope = $rootScope.$new();
            requestingFacilityFactory = $injector.get('requestingFacilityFactory');
        });

        supplyingFacilities = [
            createObjWithId('facility-one'),
            createObjWithId('facility-two')
        ];

        requestingFacilities = [
            createObjWithId('facility-three'),
            createObjWithId('facility-four'),
            createObjWithId('facility-five')
        ];

        programs = [
            createObjWithId('program-one')
        ];

        orders = [
            createObjWithId('order-one'),
            createObjWithId('order-two')
        ];

        items = [
            'itemOne', 'itemTwo'
        ];
    });

    describe('initialization', function() {

        var $controllerMock;

        beforeEach(function() {
            vm = $controller('OrderViewController', {
                supplyingFacilities: supplyingFacilities,
                requestingFacilities: requestingFacilities,
                programs: programs,
                orders: items,
                $scope: scope
            });

            spyOn(scope, '$watch').andCallThrough();
            spyOn(requestingFacilityFactory, 'loadRequestingFacilities').andCallFake(function(supplyingFacilityId) {
                if (supplyingFacilityId == 'facility-one') {
                    vm.requestingFacilities = [requestingFacilities[0], requestingFacilities[1]];
                    return $q.when([requestingFacilities[0], requestingFacilities[1]]);
                } else {
                    vm.requestingFacilities = [requestingFacilities[2]];
                    return $q.when([requestingFacilities[2]]);
                }
            });
        });

        it('should expose supplying facilities', function() {
            vm.$onInit();
            expect(vm.supplyingFacilities).toEqual(supplyingFacilities);
        });

        it('should expose requesting facilities', function() {
            vm.$onInit();
            expect(vm.requestingFacilities).toEqual(requestingFacilities);
        });

        it('should expose programs', function() {
            vm.$onInit();
            expect(vm.programs).toEqual(programs);
        });

        it('should set startDate if start date from was passed through the URL', function() {
            $stateParams.startDate = '2017-01-31T00:00:00.000Z';

            vm.$onInit();

            expect(vm.startDate).toEqual(new Date('2017-01-31'));
        });

        it('should not set starDate if start date from not passed through the URL', function() {
            $stateParams.startDate = undefined;

            vm.$onInit();

            expect(vm.starDate).toBeUndefined();
        });

        it('should set endDate if end date to was passed through the URL', function() {
            $stateParams.endDate = '2017-01-31T00:00:00.000Z';

            vm.$onInit();

            expect(vm.endDate).toEqual(new Date('2017-01-31'));
        });

        it('should not set endDate if end date to not passed through the URL', function() {
            $stateParams.endDate = undefined;

            vm.$onInit();

            expect(vm.endDate).toBeUndefined();
        });

        it('should call watch', function() {
            vm.$onInit();

            vm.supplyingFacility = supplyingFacilities[0];
            $rootScope.$apply();

            expect(scope.$watch).toHaveBeenCalled();
            expect(requestingFacilityFactory.loadRequestingFacilities).toHaveBeenCalledWith(supplyingFacilities[0].id);
            expect(vm.requestingFacilities).toEqual([requestingFacilities[0], requestingFacilities[1]]);

            vm.supplyingFacility = supplyingFacilities[1];
            $rootScope.$apply();

            expect(scope.$watch).toHaveBeenCalled();
            expect(requestingFacilityFactory.loadRequestingFacilities).toHaveBeenCalledWith(supplyingFacilities[1].id);
            expect(vm.requestingFacilities).toEqual([requestingFacilities[2]]);
        });

    });

    describe('loadOrders', function() {

        beforeEach(function() {
            initController();
            vm.$onInit();
            spyOn($state, 'go').andReturn();
        });

        it('should set program', function() {
            vm.program = {id: 'program-one'};

            vm.loadOrders();

            expect($state.go).toHaveBeenCalledWith('openlmis.orders.view', {
                supplyingFacility: null,
                program: vm.program.id,
                requestingFacility: null,
                startDate: null,
                endDate: null,
            }, {reload: true});
        });

        it('should set supplying facility', function() {
            vm.supplyingFacility = {id: 'facility-one'};

            vm.loadOrders();

            expect($state.go).toHaveBeenCalledWith('openlmis.orders.view', {
                supplyingFacility: vm.supplyingFacility.id,
                program: null,
                requestingFacility: null,
                startDate: null,
                endDate: null,
            }, {reload: true});
        });

        it('should set requesting facility', function() {
            vm.requestingFacility = {id: 'facility-one'};

            vm.loadOrders();

            expect($state.go).toHaveBeenCalledWith('openlmis.orders.view', {
                supplyingFacility: null,
                program: null,
                requestingFacility: vm.requestingFacility.id,
                startDate: null,
                endDate: null,
            }, {reload: true});
        });

        it('should set startDate', function() {
            vm.startDate = new Date('2017-01-31T23:00:00.000Z');

            vm.loadOrders();

            expect($state.go).toHaveBeenCalledWith('openlmis.orders.view', {
                supplyingFacility: null,
                program: null,
                requestingFacility: null,
                startDate: '2017-01-31',
                endDate: null
            }, {reload: true});
        });

        it('should set endDate', function() {
            vm.endDate = new Date('2017-01-31T23:00:00.000Z');

            vm.loadOrders();

            expect($state.go).toHaveBeenCalledWith('openlmis.orders.view', {
                supplyingFacility: null,
                program: null,
                requestingFacility: null,
                startDate: null,
                endDate: '2017-01-31'
            }, {reload: true});
        });

        it('should reload state', function() {
           vm.loadOrders();
           expect($state.go).toHaveBeenCalled();
        });

    });

    describe('getPrintUrl', function() {

        beforeEach(function() {
            fulfillmentUrlFactoryMock = jasmine.createSpy();
            fulfillmentUrlFactoryMock.andCallFake(function(url) {
                return 'http://some.url' + url;
            });

            vm = $controller('OrderViewController', {
                supplyingFacilities: supplyingFacilities,
                requestingFacilities: requestingFacilities,
                programs: programs,
                orders: items,
                fulfillmentUrlFactory: fulfillmentUrlFactoryMock,
                $scope: scope
            });
        });

        it('should prepare print URL correctly', function () {
            expect(vm.getPrintUrl(orders[0]))
                .toEqual('http://some.url/api/orders/order-one/print?format=pdf');
        });
    });

    describe('getDownloadUrl', function() {

        beforeEach(function() {
            fulfillmentUrlFactoryMock = jasmine.createSpy();
            fulfillmentUrlFactoryMock.andCallFake(function(url) {
                return 'http://some.url' + url;
            });

            vm = $controller('OrderViewController', {
                supplyingFacilities: supplyingFacilities,
                requestingFacilities: requestingFacilities,
                programs: programs,
                orders: items,
                fulfillmentUrlFactory: fulfillmentUrlFactoryMock,
                $scope: scope
            });
        });

        it('should prepare download URL correctly', function () {
            expect(vm.getDownloadUrl(orders[1]))
                .toEqual('http://some.url/api/orders/order-two/export?type=csv');
        });
    });

    function initController() {
        vm = $controller('OrderViewController', {
            supplyingFacilities: supplyingFacilities,
            requestingFacilities: requestingFacilities,
            programs: programs,
            orders: items,
            $scope: scope
        });
        vm.$onInit();
    }
});

function createObjWithId(id) {
    return {
        id: id
    };
}
