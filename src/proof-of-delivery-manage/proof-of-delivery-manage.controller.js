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
        '$stateParams'
    ];

    function controller(proofOfDeliveryManageService, $state, loadingModalService, notificationService,
                        pods, $stateParams) {
        var vm = this;

        vm.$onInit = onInit;
        vm.openPod = openPod;
        vm.loadOrders = loadOrders;
        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-manage.controller:ProofOfDeliveryManageController
         * @name isSupervised
         * @type {Boolean}
         *
         * @description
         * Holds currently selected facility selection type:
         *  false - my facility
         *  true - supervised facility
         */
        vm.isSupervised = false;

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

            stateParams.facility = vm.facility.id;
            stateParams.program = vm.program.id;
            stateParams.supervised = vm.isSupervised;

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
            withUiBlocking(proofOfDeliveryManageService.getByOrderId(orderId)).then(function(pod) {
                $state.go('openlmis.orders.podManage.podView', {
                    podId: pod.id
                });
            }, function() {
                notificationService.error('proofOfDeliveryManage.noOrderFound');
            });
        }

        function withUiBlocking(promise) {
            loadingModalService.open();
            promise.finally(loadingModalService.close);
            return promise;
        }
    }
})();
