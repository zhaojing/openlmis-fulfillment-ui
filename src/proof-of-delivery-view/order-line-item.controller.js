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
     * @name proof-of-delivery-view.controller:OrderLineItemController
     *
     * @description
     * Controller of the orderLineItem directive.
     */
    angular
        .module('proof-of-delivery-view')
        .controller('OrderLineItemController', OrderLineItemController);

    OrderLineItemController.$inject = ['$scope'];

    function OrderLineItemController($scope) {
        var vm = this;

        vm.$onInit = onInit;
        vm.getReasonName = getReasonName;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-view.controller:OrderLineItemController
         * @type {ProofOfDelivery}
         * @name proofOfDelivery
         *
         * @description
         * Represents a Proof of Delivery.
         */
        vm.proofOfDelivery = undefined;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-view.controller:OrderLineItemController
         * @type {Object}
         * @name orderLineItem
         *
         * @description
         * Represents a single Order Line Item.
         */
        vm.orderLineItem = undefined;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-view.controller:OrderLineItemController
         * @type {Array}
         * @name reasonAssignments
         *
         * @description
         * A list od available reasons for rejecting stock.
         */
        vm.reasonAssignments = undefined;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-view.controller:OrderLineItemController
         * @type {Array}
         * @name fulfillingLineItems
         *
         * @description
         * A list of Proof of Delivery Line Items that fulfill the specific Order Line Item.
         */
        vm.fulfillingLineItems = undefined;

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery-view.controller:OrderLineItemController
         * @name $onInit
         *
         * @description
         * Initialization method of the OrderLineItemController.
         */
        function onInit() {
            vm.proofOfDelivery = $scope.proofOfDelivery;
            vm.orderLineItem = $scope.orderLineItem;
            vm.reasonAssignments = $scope.reasonAssignments;
            vm.fulfillingLineItems = filterLineItemsByOrderable(
                $scope.proofOfDelivery.lineItems,
                vm.orderLineItem.orderable
            );
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery-view.controller:OrderLineItemController
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

        function filterLineItemsByOrderable(lineItems, orderable) {
            return lineItems.filter(function(lineItem) {
                return lineItem.orderable.id === orderable.id;
            });
        }
    }

})();
