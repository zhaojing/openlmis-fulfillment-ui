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

    var $q, $state, $rootScope, $location, $templateCache, orderRepository, paginationService, state, FULFILLMENT_RIGHTS, REQUISITION_RIGHTS, pods, authorizationService;

    beforeEach(function() {
        loadModules();
        injectServices();
        prepareTestData();
        prepareSpies();
    });

    it('should be available under \'orders/manage\'', function() {
        expect($state.current.name).not.toEqual('openlmis.orders.podManages');

        goToUrl('/orders/manage');

        expect($state.current.name).toEqual('openlmis.orders.podManage');
    });

    it('should resolve pods', function() {
        goToUrl('/orders/manage?page=0&size=10&program=program-id');

        expect(getResolvedValue('pods')).toEqual(pods);
    });

    it('should use template', function() {
        spyOn($templateCache, 'get').andCallThrough();

        goToUrl('/orders/manage');

        expect($templateCache.get).toHaveBeenCalledWith('proof-of-delivery-manage/proof-of-delivery-manage.html');
    });

    it('should require requisition create and pods manage rights to enter', function() {
        expect(state.accessRights).toEqual([REQUISITION_RIGHTS.REQUISITION_CREATE, FULFILLMENT_RIGHTS.PODS_MANAGE]);
    });

    function loadModules() {
        module('proof-of-delivery-manage');
    }

    function injectServices() {
        inject(function($injector) {
            $q = $injector.get('$q');
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            $location = $injector.get('$location');
            $templateCache = $injector.get('$templateCache');
            orderRepository = $injector.get('orderRepository');
            authorizationService = $injector.get('authorizationService');
            paginationService = $injector.get('paginationService');
            FULFILLMENT_RIGHTS = $injector.get('FULFILLMENT_RIGHTS');
            REQUISITION_RIGHTS = $injector.get('REQUISITION_RIGHTS');
        });
    }

    function prepareTestData() {
        state = $state.get('openlmis.orders.podManage');
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
        spyOn(orderRepository, 'searchOrdersForManagePod').andReturn($q.when({
            content: pods
        }));
    }

    function getResolvedValue(name) {
        return $state.$current.locals.globals[name];
    }

    function goToUrl(url) {
        $location.url(url);
        $rootScope.$apply();
    }
});
