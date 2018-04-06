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


describe('openlmis.orders.fulfillment state', function() {

    var $q, $state, $rootScope, requestingFacilityFactory, state, minimalFacilities,
        FULFILLMENT_RIGHTS, $stateParams, facilityFactory, facilities, paginationService,
        orderRepository, ORDER_STATUS, programs, programService, MinimalFacilityDataBuilder,
        FacilityDataBuilder, ProgramDataBuilder;

    beforeEach(function() {
        loadModules();
        injectServices();
        prepareTestData();
        prepareSpies();
    });

    it('should fetch a list of ordering facilities', function() {
        $stateParams.requestingFacilityId = 'requesting-facility';

        var result;

        state.resolve.orderingFacilities(facilities, requestingFacilityFactory)
        .then(function(orderingFacilities){
            result = orderingFacilities;
        });
        $rootScope.$apply();

        expect(result).toEqual(minimalFacilities);
    });

    it('should fetch a list of supervised facilities', function() {
        var result;

        state.resolve.supervisedFacilities(facilityFactory).then(function(supervisedFacilities){
            result = supervisedFacilities;
        });
        $rootScope.$apply();

        expect(result).toEqual(facilities);
    });

    it('should set FULFILLING and ORDERED statuses as default', function() {
        $stateParams.status = undefined;

        state.resolve.orders(paginationService, orderRepository, $stateParams, ORDER_STATUS);
        $rootScope.$apply();

        expect($stateParams.status).toEqual(undefined);
        expect(orderRepository.search).toHaveBeenCalledWith(
            {status: [ORDER_STATUS.FULFILLING, ORDER_STATUS.ORDERED], page: 0, size: 10});
    });

    it('should remove not available statuses from the url', function() {
        $stateParams.status = [ORDER_STATUS.IN_ROUTE, ORDER_STATUS.ORDERED];

        state.resolve.orders(paginationService, orderRepository, $stateParams, ORDER_STATUS);
        $rootScope.$apply();

        expect($stateParams.status).toEqual([ORDER_STATUS.ORDERED]);
        expect(orderRepository.search).toHaveBeenCalledWith(
            {status: [ORDER_STATUS.ORDERED], page: 0, size: 10});
    });

    it('should require FULFILLMENT_RIGHTS right to enter', function() {
        expect(state.accessRights).toEqual(
            [FULFILLMENT_RIGHTS.SHIPMENTS_VIEW, FULFILLMENT_RIGHTS.ORDERS_VIEW]);
    });

    function loadModules() {
        module('openlmis-main-state');
        module('order');
        module('referencedata-facilities-permissions');
        module('referencedata-program');
        module('order-fulfillment');
    }

    function injectServices() {
        inject(function($injector) {
            $q = $injector.get('$q');
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            facilityFactory = $injector.get('facilityFactory');
            requestingFacilityFactory = $injector.get('requestingFacilityFactory');
            paginationService = $injector.get('paginationService');
            programService = $injector.get('programService');
            orderRepository = $injector.get('orderRepository');
            ORDER_STATUS = $injector.get('ORDER_STATUS');
            FULFILLMENT_RIGHTS = $injector.get('FULFILLMENT_RIGHTS');
            MinimalFacilityDataBuilder = $injector.get('MinimalFacilityDataBuilder');
            FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
        });
    }

    function prepareTestData() {
        state = $state.get('openlmis.orders.fulfillment');
        $stateParams = {};
        facilities = [
            new FacilityDataBuilder().withId('facility-1').build(),
            new FacilityDataBuilder().withId('facility-2').build()
        ];
        minimalFacilities = [
            new MinimalFacilityDataBuilder().withId('facility-1').build(),
            new MinimalFacilityDataBuilder().withId('facility-2').build(),
            new MinimalFacilityDataBuilder().withId('facility-3').build()
        ];
        programs = [
            new ProgramDataBuilder().build(),
            new ProgramDataBuilder().build()
        ];
    }

    function prepareSpies() {
        spyOn(facilityFactory, 'getSupervisedFacilitiesBasedOnRights').andReturn($q.when(facilities));
        spyOn(requestingFacilityFactory, 'loadRequestingFacilities').andReturn($q.when(minimalFacilities));
        spyOn(orderRepository, 'search').andReturn($q.when());
        spyOn(programService, 'getAll').andReturn($q.when(programs));
    }
});
