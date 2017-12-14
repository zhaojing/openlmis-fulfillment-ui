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
     * @ngdoc service
     * @name proof-of-delivery-manage.orderRepository
     *
     * @description
     * Decorates the orderRepository with the ability to filter orders for Manage POD view.
     */
    angular
        .module('proof-of-delivery-manage')
        .config(config);

    config.$inject = ['$provide'];

    function config($provide) {
        $provide.decorator('orderRepository', decorator);
    }

    decorator.$inject = ['$delegate', 'ORDER_STATUS', 'orderService'];
    function decorator($delegate, ORDER_STATUS, orderService) {

        $delegate.searchOrdersForManagePod = searchOrdersForManagePod;

        return $delegate;

        /**
         * @ngdoc method
         * @methodOf order.orderRepository
         * @name searchOrdersForManagePod
         *
         * @description
         * Gets orders from the server using orderService and filter them by status.
         *
         * @param {Object} searchParams parameters for searching orders, i.e.
         * {
         *      program: 'programID',
         *      requestingFacility: 'facilityID'
         * }
         * @return {Promise} the promise resolving to a list of all matching orders
         */
        function searchOrdersForManagePod(searchParams) {
            searchParams.status = [
                 ORDER_STATUS.PICKED,
                 ORDER_STATUS.TRANSFER_FAILED,
                 ORDER_STATUS.READY_TO_PACK,
                 ORDER_STATUS.ORDERED,
                 ORDER_STATUS.RECEIVED,
                 ORDER_STATUS.IN_ROUTE
            ];
            return orderService.search(searchParams);
        }
    }
})();
