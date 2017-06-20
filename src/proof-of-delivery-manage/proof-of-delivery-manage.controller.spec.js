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

describe('ProofOfDeliveryManageController', function() {

    var vm, orderFactoryMock, facilityFactoryMock, $rootScope, loadingModalServiceMock, programs,
        facility, deferred, pod, $state, $q, $controller,
        $stateParams, $controllerMock, facilities, facilityTwo;

    beforeEach(function() {

        facility = {
            'id': 'facility-one',
            'supportedPrograms': programs
        };

        facilityTwo = {
            'id': 'facility-two',
            'supportedPrograms': programs
        };

        facilities = [facility, facilityTwo];

        programs = [
            createObjWithId('program-one'),
            createObjWithId('program-two')
        ];

        pod = {
            id: 'pod-one',
            order: { id: 'order-one' }
        };

        stateParams = {
            page: 0,
            size: 10
        };

        module('proof-of-delivery-manage', function($provide) {
            orderFactoryMock = jasmine.createSpyObj('orderFactory', ['getPod']);
            loadingModalServiceMock = jasmine.createSpyObj('loadingModalService', ['open', 'close']);

            $provide.factory('orderFactory', function() {
                return orderFactoryMock;
            });

            $provide.factory('loadingModalService', function() {
                return loadingModalServiceMock;
            });

        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            deferred = $q.defer();
            $state = $injector.get('$state');
            $controller = $injector.get('$controller');
            $stateParams = $injector.get('$stateParams');
            vm = $controller('ProofOfDeliveryManageController', {
                pods: [pod],
                $stateParams: stateParams
            });
        });
    });

    it('initialization should expose pod', function() {
        vm.$onInit();

        expect(vm.pods).toEqual([pod]);
    });

    it('loadOrders should reload state with right params', function() {
        spyOn($state, 'go');

        vm.facility =  {
            id: 'facility-one'
        };

        vm.program = {
            id: 'program-one'
        };
        vm.isSupervised = true;

        vm.$onInit();
        vm.loadOrders();

        expect($state.go).toHaveBeenCalledWith('openlmis.orders.podManage', {
            facility: vm.facility.id,
            program: vm.program.id,
            supervised: vm.isSupervised,
            page: 0,
            size: 10
        }, {reload: true});
    });

    describe('openPod', function() {
        it('should change state when user select order to view its POD', function() {
            orderFactoryMock.getPod.andReturn(deferred.promise);
            spyOn($state, 'go').andReturn();

            vm.openPod('order-one');
            deferred.resolve(pod);
            $rootScope.$apply();

            expect($state.go).toHaveBeenCalledWith('openlmis.orders.podManage.podView', {podId: 'pod-one'});
        });
    });

});

function createObjWithId(id) {
    return {
        id: id
    };
}

function createOrder(id, status) {
    return {
        id: id,
        status: status
    };
}

function checkConnection() {
    return $q.when(true);
}
