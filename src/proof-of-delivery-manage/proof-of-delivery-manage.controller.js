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

(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name proof-of-delivery-manage.controller:ProofOfDeliveryManageController
     *
     * @description
     * Controller for proof of delivery manage page
     */
    angular
        .module('proof-of-delivery-manage')
        .controller('ProofOfDeliveryManageController', controller);

    controller.$inject = [
        'proofOfDeliveryManageService', '$state', 'loadingModalService', 'notificationService', 'pods',
        '$stateParams', 'programs', 'requestingFacilities', 'supplyingFacilities'
    ];

    function controller(proofOfDeliveryManageService, $state, loadingModalService, notificationService,
                        pods, $stateParams, programs, requestingFacilities, supplyingFacilities) {
        var vm = this;

        vm.$onInit = onInit;
        vm.openPod = openPod;
        vm.loadOrders = loadOrders;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-manage.controller:ProofOfDeliveryManageController
         * @name pods
         * @type {Array}
         *
         * @description
         * Holds pods that will be displayed.
         */
        vm.pods = undefined;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-manage.controller:ProofOfDeliveryManageController
         * @name programs
         * @type {Array}
         *
         * @description
         * Holds list of supervised programs.
         */
        vm.programs = undefined;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-manage.controller:ProofOfDeliveryManageController
         * @name requestingFacilities
         * @type {Array}
         *
         * @description
         * Holds list of supervised requesting facilities.
         */
        vm.requestingFacilities = undefined;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-manage.controller:ProofOfDeliveryManageController
         * @name supplyingFacilities
         * @type {Array}
         *
         * @description
         * Holds list of supervised supplying facilities.
         */
        vm.supplyingFacilities = undefined;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-manage.controller:ProofOfDeliveryManageController
         * @name program
         * @type {Object}
         *
         * @description
         * Holds selected program.
         */
        vm.program = undefined;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-manage.controller:ProofOfDeliveryManageController
         * @name requestingFacility
         * @type {Object}
         *
         * @description
         * Holds selected requesting facility.
         */
        vm.requestingFacility = undefined;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-manage.controller:ProofOfDeliveryManageController
         * @name supplyingFacility
         * @type {Object}
         *
         * @description
         * Holds selected supplying facility.
         */
        vm.supplyingFacility = undefined;

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery-manage.controller:ProofOfDeliveryManageController
         * @name $onInit
         *
         * @description
         * Initialization method called after the controller has been created. Responsible for
         * setting data to be available on the view.
         */
        function onInit() {
            vm.pods = pods;
            vm.programs = programs;
            vm.requestingFacilities = requestingFacilities;
            vm.supplyingFacilities = supplyingFacilities;
            vm.program = getSelectedObjectById(programs, $stateParams.programId);
            vm.requestingFacility = getSelectedObjectById(requestingFacilities, $stateParams.requestingFacilityId);
            vm.supplyingFacility = getSelectedObjectById(supplyingFacilities, $stateParams.supplyingFacilityId);
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery-manage.controller:ProofOfDeliveryManageController
         * @name loadOrders
         *
         * @description
         * Retrieves the list of orders matching the selected requesting facility and program.
         *
         * @return {Array} the list of matching orders
         */
        function loadOrders() {
            var stateParams = angular.copy($stateParams);

            stateParams.programId = vm.program.id;
            stateParams.requestingFacilityId = vm.requestingFacility ? vm.requestingFacility.id : null;
            stateParams.supplyingFacilityId = vm.supplyingFacility ? vm.supplyingFacility.id : null;

            $state.go('openlmis.orders.podManage', stateParams, {
                reload: true
            });
        }

        /**
         *
         * @ngdoc method
         * @methodOf proof-of-delivery-manage.controller:ProofOfDeliveryManageController
         * @name openPod
         *
         * @description
         * Redirect to POD page.
         *
         * @param {String} orderId id of order to find it's POD
         */
        function openPod(orderId) {
            loadingModalService.open();
            proofOfDeliveryManageService.getByOrderId(orderId)
            .then(function(pod) {
                $state.go('openlmis.orders.podManage.podView', {
                    podId: pod.id
                });
            })
            .catch(function() {
                notificationService.error('proofOfDeliveryManage.noOrderFound');
                loadingModalService.close();
            });
        }        
    }

    function getSelectedObjectById(list, id) {
        if (!list || list.length < 1 || !id) {
            return null;
        }
        var filteredList = list.filter(function(object) {
            return object.id === id;
        });
        return filteredList.length > 0 ? filteredList[0] : null;
    }
})();
