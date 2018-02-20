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
     * @name order.Order
     *
     * @description
     * Represents a single order.
     */
    angular
        .module('order')
        .factory('Order', Order);

    Order.$inject = ['ORDER_STATUS'];

    function Order(ORDER_STATUS) {
        Order.prototype.isFulfillmentStarted = isFulfillmentStarted;

        return Order;

        function Order(order) {
            angular.merge(this, order);
        }

        /**
         * @ngdoc method
         * @methodOf order.Order
         * @name isFulfillmentStarted
         *
         * @description
         * Checks whether an order fulfillment has been started.
         *
         * @param  {Object} order   the order status
         * @return {Boolean}        true if status is FULFILLING
         */
        function isFulfillmentStarted() {
            return this.status == ORDER_STATUS.FULFILLING;
        }
    }

})();
