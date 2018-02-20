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
     * @name proof-of-delivery-view.controller:PodViewController
     *
     * @description
     * Controller that drives the POD view screen.
     */
    angular
    .module('proof-of-delivery-view')
    .controller('ProofOfDeliveryViewController', ProofOfDeliveryViewController);

    ProofOfDeliveryViewController.$inject = ['proofOfDelivery', 'order', 'reasonAssignments', 'messageService', 'VVM_STATUS'];

    function ProofOfDeliveryViewController(proofOfDelivery, order, reasonAssignments, messageService, VVM_STATUS) {
        var vm = this;

        vm.$onInit = onInit;
        vm.getStatusDisplay = getStatusDisplay;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-view.controller:PodViewController
         * @name pod
         * @type {Object}
         *
         * @description
         * Holds Proof of Delivery.
         */
        vm.proofOfDelivery = undefined;

        function onInit() {
            vm.proofOfDelivery = proofOfDelivery;
            vm.order = order;
            vm.reasonAssignments = reasonAssignments;
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery-view.controller:PodViewController
         * @name getStatusDisplay
         *
         * @description
         * Returns VVM status display.
         *
         * @param  {String} status VVM status
         * @return {String}        VVM status display name
         */
        function getStatusDisplay(status) {
            return messageService.get(VVM_STATUS.$getDisplayName(status));
        };
    }

}());
