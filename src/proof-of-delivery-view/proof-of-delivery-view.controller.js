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

    ProofOfDeliveryViewController.$inject = [
        'proofOfDelivery', 'order', 'reasonAssignments', 'messageService', 'VVM_STATUS',
        'fulfillingLineItems', 'fulfillmentUrlFactory', 'canEdit'
    ];

    function ProofOfDeliveryViewController(proofOfDelivery, order, reasonAssignments,
                                           messageService, VVM_STATUS, fulfillingLineItems,
                                           fulfillmentUrlFactory, canEdit) {
        var vm = this;

        vm.$onInit = onInit;
        vm.getStatusDisplayName = getStatusDisplayName;
        vm.getReasonName = getReasonName;
        vm.getPrintUrl = getPrintUrl;
        vm.isEditable = isEditable;

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

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-view.controller:PodViewController
         * @name showVvmColumn
         * @type {boolean}
         *
         * @description
         * Indicates if VVM Status column should be shown for current Proof of Delivery.
         */
        vm.showVvmColumn = undefined;

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery-view.controller:PodViewController
         * @name $onInit
         *
         * @description
         * Initialization method of the PodViewController.
         */
        function onInit() {
            vm.order = order;
            vm.reasonAssignments = reasonAssignments;
            vm.proofOfDelivery = proofOfDelivery;
            vm.fulfillingLineItems = fulfillingLineItems;
            vm.vvmStatuses = VVM_STATUS;
            vm.showVvmColumn = proofOfDelivery.hasProductsUseVvmStatus();
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery-view.controller:PodViewController
         * @name getStatusDisplayName
         *
         * @description
         * Returns translated status display name.
         */
        function getStatusDisplayName(status) {
            return messageService.get(VVM_STATUS.$getDisplayName(status));
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery-view.controller:PodViewController
         * @name getReasonName
         *
         * @description
         * Returns a name of the reason with the given ID.
         *
         * @param   {string}    id  the ID of the reason
         * @return  {string}        the name of the reason
         */
        function getReasonName(id) {
            if (!id) {
                return;
            }

            return vm.reasonAssignments.filter(function(assignment) {
                return assignment.reason.id === id;
            })[0].reason.name;
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery-view.controller:PodViewController
         * @name getPrintUrl
         *
         * @description
         * Prepares a print URL for the given proof of delivery.
         *
         * @param  {Object} podId the UUID of the proof of delivery to prepare the URL for
         * @return {String}       the prepared URL
         */
        function getPrintUrl(podId) {
            return fulfillmentUrlFactory('/api/proofsOfDelivery/' + podId + '/print?format=pdf');
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery-view.controller:PodViewController
         * @name isEditable
         *
         * @description
         * Checks Proof of Delivery status and user permissions to indicate if view should be editable.
         *
         * @return {boolean} true if Proof of Delivery is not confirmed yet and user has permission to edit.
         */
        function isEditable() {
            return vm.proofOfDelivery.isInitiated() && canEdit;
        }
    }
}());
