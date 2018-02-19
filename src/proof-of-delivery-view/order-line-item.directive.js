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
     * @ngdoc directive
     * @name proof-of-delivery-view.orderLineItem
     *
     * @description
     * Displays row for Order Line Item and all fulfilling Proof of Delivery Line Items.
     *
     * @example
     * '''
     * <tbody order-line-item="lineItem" proof-of-delivery="proofOfDelivery"
     *  reasonAssignments="reasonAssignments">
     * </tbody>
     * '''
     */
    angular
        .module('proof-of-delivery-view')
        .directive('orderLineItem', directive);

    directive.$inject = [];

    function directive() {
        var directive = {
            restrict: 'A',
            controller: 'OrderLineItemController',
            controllerAs: 'vm',
            scope: {
                orderLineItem: '=',
                proofOfDelivery: '=',
                reasonAssignments: '='
            },
            link: link,
            templateUrl: 'proof-of-delivery-view/order-line-item.html'
        };
        return directive;
    }

})();
