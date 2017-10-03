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


describe('openlmis.orders.podManage state', function() {

    var $q, $state, $rootScope, orderFactory, paginationService, state, FULFILLMENT_RIGHTS, REQUISITION_RIGHTS, $stateParams, pods;

    beforeEach(function() {
        loadModules();
        injectServices();
        prepareTestData();
        prepareSpies();
    });

    it('should fetch a list of pods', function() {
        $stateParams.facility = 'facility';
        $stateParams.program = 'program';
        $stateParams.supervised = false;

        var result;

        state.resolve.pods(paginationService, orderFactory, $stateParams).then(function(response) {
            result = response;
        });
        $rootScope.$apply();

        var stateParams = {
            requestingFacility: 'facility',
            program: 'program',
            supervised: false
        };

        expect(result).toEqual(pods);
        expect($stateParams.facility).toEqual('facility');
        expect(orderFactory.searchOrdersForManagePod).toHaveBeenCalledWith(stateParams);
    });

    it('should require requisition create and pods manage rights to enter', function() {
        expect(state.accessRights).toEqual([REQUISITION_RIGHTS.REQUISITION_CREATE, FULFILLMENT_RIGHTS.PODS_MANAGE]);
    });

    function loadModules() {
        module('openlmis-main-state');
        module('order');
        module('proof-of-delivery-manage');
    }

    function injectServices() {
        inject(function($injector) {
            $q = $injector.get('$q');
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            orderFactory = $injector.get('orderFactory');
            paginationService = $injector.get('paginationService');
            FULFILLMENT_RIGHTS = $injector.get('FULFILLMENT_RIGHTS');
            REQUISITION_RIGHTS = $injector.get('REQUISITION_RIGHTS');
        });
    }

    function prepareTestData() {
        state = $state.get('openlmis.orders.podManage');
        $stateParams = {};
        pods = [
            {
                id: 'pod-1',
                name: 'POD One'
            },
            {
                id: 'pod-2',
                name: 'POD Two'
            },
            {
                id: 'pod-3',
                name: 'POD Three'
            }
        ];
    }

    function prepareSpies() {
        spyOn(orderFactory, 'searchOrdersForManagePod').andReturn($q.when(pods));
        spyOn(paginationService, 'registerUrl').andCallFake(function(stateParams, method) {
            var deferred = $q.defer();
            method(stateParams).then(function(response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        });
    }
});
