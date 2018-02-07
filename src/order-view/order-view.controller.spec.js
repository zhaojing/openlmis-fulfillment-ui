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

    var vm, $rootScope, fulfillmentUrlFactoryMock, supplyingFacilities, requestingFacilities,
        programs, orders, $controller, $stateParams, scope, requestingFacilityFactory, $state,
        BasicOrderResponseDataBuilder, ORDER_STATUS, ProgramDataBuilder, FacilityDataBuilder;

    beforeEach(function() {
        module('order-view');
        module('referencedata-facility');
        module('referencedata-program');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $stateParams = $injector.get('$stateParams');
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            scope = $rootScope.$new();
            requestingFacilityFactory = $injector.get('requestingFacilityFactory');
            BasicOrderResponseDataBuilder = $injector.get('BasicOrderResponseDataBuilder');
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            ORDER_STATUS = $injector.get('ORDER_STATUS');
        });

        supplyingFacilities = [
            new FacilityDataBuilder().withId('facility-one').build(),
            new FacilityDataBuilder().withId('facility-two').build()
        ];

        requestingFacilities = [
            new FacilityDataBuilder().withId('facility-three').build(),
            new FacilityDataBuilder().withId('facility-four').build(),
            new FacilityDataBuilder().withId('facility-five').build()
        ];

        programs = [
            new ProgramDataBuilder().withId('program-one').build()
        ];

        orders = [
            new BasicOrderResponseDataBuilder()
                .withStatus(ORDER_STATUS.ORDERED)
                .withId('order-one')
                .build(),
            new BasicOrderResponseDataBuilder()
            .withStatus(ORDER_STATUS.FULFILLING)
            .withId('order-two')
            .build()
        ];
    });

    describe('initialization', function() {

        beforeEach(function() {
            vm = $controller('OrderViewController', {
                supplyingFacilities: supplyingFacilities,
                requestingFacilities: requestingFacilities,
                programs: programs,
                orders: orders,
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

        it('should set periodStartDate if period start date from was passed through the URL', function() {
            $stateParams.periodStartDate = '2017-01-31';

            vm.$onInit();

            expect(vm.periodStartDate).toEqual('2017-01-31');
        });

        it('should not set periodStartDate if period start date from not passed through the URL', function() {
            $stateParams.periodStartDate = undefined;

            vm.$onInit();

            expect(vm.periodStartDate).toBeUndefined();
        });

        it('should set periodEndDate if period end date to was passed through the URL', function() {
            $stateParams.periodEndDate = '2017-01-31';

            vm.$onInit();

            expect(vm.periodEndDate).toEqual('2017-01-31');
        });

        it('should not set periodEndDate if period end date to not passed through the URL', function() {
            $stateParams.periodEndDate = undefined;

            vm.$onInit();

            expect(vm.periodEndDate).toBeUndefined();
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
                periodStartDate: null,
                periodEndDate: null,
            }, {reload: true});
        });

        it('should set supplying facility', function() {
            vm.supplyingFacility = {id: 'facility-one'};

            vm.loadOrders();

            expect($state.go).toHaveBeenCalledWith('openlmis.orders.view', {
                supplyingFacility: vm.supplyingFacility.id,
                program: null,
                requestingFacility: null,
                periodStartDate: null,
                periodEndDate: null,
            }, {reload: true});
        });

        it('should set requesting facility', function() {
            vm.requestingFacility = {id: 'facility-one'};

            vm.loadOrders();

            expect($state.go).toHaveBeenCalledWith('openlmis.orders.view', {
                supplyingFacility: null,
                program: null,
                requestingFacility: vm.requestingFacility.id,
                periodStartDate: null,
                periodEndDate: null,
            }, {reload: true});
        });

        it('should set periodStartDate', function() {
            vm.periodStartDate = new Date('2017-01-31T23:00:00.000Z');

            vm.loadOrders();

            expect($state.go).toHaveBeenCalledWith('openlmis.orders.view', {
                supplyingFacility: null,
                program: null,
                requestingFacility: null,
                periodStartDate: '2017-01-31',
                periodEndDate: null
            }, {reload: true});
        });

        it('should set periodEndDate', function() {
            vm.periodEndDate = new Date('2017-01-31T23:00:00.000Z');

            vm.loadOrders();

            expect($state.go).toHaveBeenCalledWith('openlmis.orders.view', {
                supplyingFacility: null,
                program: null,
                requestingFacility: null,
                periodStartDate: null,
                periodEndDate: '2017-01-31'
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
                orders: orders,
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
                orders: orders,
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
            orders: orders,
            $scope: scope
        });
        vm.$onInit();
    }
});
