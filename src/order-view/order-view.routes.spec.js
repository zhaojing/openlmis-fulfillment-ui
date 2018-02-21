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


describe('openlmis.orders.view state', function() {

    var $q, $state, $rootScope, requestingFacilityFactory, state, minimalFacilities, FULFILLMENT_RIGHTS, $stateParams;

    beforeEach(function() {
        loadModules();
        injectServices();
        prepareTestData();
        prepareSpies();
    });

    it('should fetch a list of requesting facilities', function() {
        $stateParams.supplyingFacilityId = 'supplying-facility';

        var result;

        state.resolve.requestingFacilities(requestingFacilityFactory, $stateParams).then(function(facilities){
            result = facilities;
        });
        $rootScope.$apply();

        expect(result).toEqual(minimalFacilities);
        expect(requestingFacilityFactory.loadRequestingFacilities).toHaveBeenCalledWith('supplying-facility');
    });

    it('should require FULFILLMENT_RIGHTS right to enter', function() {
        expect(state.accessRights).toEqual([FULFILLMENT_RIGHTS.PODS_MANAGE, FULFILLMENT_RIGHTS.ORDERS_VIEW]);
    });

    function loadModules() {
        module('openlmis-main-state');
        module('order');
        module('order-view');
    }

    function injectServices() {
        inject(function($injector) {
            $q = $injector.get('$q');
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            requestingFacilityFactory = $injector.get('requestingFacilityFactory');
            FULFILLMENT_RIGHTS = $injector.get('FULFILLMENT_RIGHTS');
        });
    }

    function prepareTestData() {
        state = $state.get('openlmis.orders.view');
        $stateParams = {};
        facilities = ['facility-1', 'facility-2'];
        minimalFacilities = [
            {
                id: 'facility-1',
                name: 'Facility One'
            },
            {
                id: 'facility-2',
                name: 'Facility Two'
            },
            {
                id: 'facility-3',
                name: 'Facility Three'
            }
        ];
    }

    function prepareSpies() {
        spyOn(requestingFacilityFactory, 'loadRequestingFacilities').andReturn($q.when(minimalFacilities));
    }
});
