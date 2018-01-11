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
     * @name shipment-view.OrderLineItem
     *
     * @description
     * Represents a single order line item along with matching shipment line items.
     */
    angular
        .module('shipment-view')
        .factory('OrderLineItem', OrderLineItem);

    OrderLineItem.$inject = [];

    function OrderLineItem() {
        OrderLineItem.prototype.calculateFillQuantity = calculateFillQuantity;

        return OrderLineItem;

        function OrderLineItem(orderLineItem, shipmentLineItems) {
            angular.merge(this, orderLineItem);
            this.shipmentLineItems = shipmentLineItems;
        }

        /**
         * @ngdoc method
         * @methodOf shipment-view.OrderLineItem
         * @name calculateFillQuantity
         *
         * @description
         * Calculates the fill quantity based on the referenced shipment line items.
         *
         * @return  {number}    the total fill quantity
         */
        function calculateFillQuantity() {
            var fillQuantity = 0;
            this.shipmentLineItems.forEach(function(shipmentLineItem) {
                fillQuantity += getNumber(shipmentLineItem.quantityShipped);
            });
            return fillQuantity;
        }

        function getNumber(number) {
            if (number) {
                return parseInt(number);
            }
            return 0;
        }
    }

})();
