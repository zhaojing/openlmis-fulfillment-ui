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

(function () {

    'use strict';

    /**
     * @ngdoc service
     * @name shipment.ShipmentLineItem
     *
     * @description
     * Represents a single shipment line item extended by the stock card summary for the orderable
     * and lot.
     */
    angular
        .module('shipment')
        .factory('ShipmentLineItem', ShipmentLineItem);

    ShipmentLineItem.$inject = [];

    function ShipmentLineItem() {

        ShipmentLineItem.prototype.validate = validate;

        return ShipmentLineItem;

        /**
         * @ngdoc method
         * @methodOf shipment.ShipmentLineItem
         * @name ShipmentLineItem
         *
         * @description
         * Creates instance of the ShipmentLineItem class.
         *
         * @param       {string}    id              the ID of the line item
         * @param       {Object}    summary         the stock card summary matching orderable and lot
         * @param       {number}    quantityShipped the shipped quantity
         */
        function ShipmentLineItem(json) {
            this.id = json.id;
            this.orderable = json.orderable;
            this.lot = json.lot;
            this.quantityShipped = json.quantityShipped;
            this.stockOnHand = json.canFulfillForMe.stockOnHand;
        }

        /**
         * @ngdoc methodOf
         * @methodOf shipment.ShipmentLineItem
         * @name validate
         *
         * @description
         * Validates the shipment line items and places any errors in an object under 'errors'
         * property.
         *
         * @returns {boolean} true if line item is valid, false otherwise.
         */
        function validate() {
            var errors = {};

            if (!this.quantityShipped && this.quantityShipped !== 0) {
                errors.quantityShipped = 'shipment.required';
            }

            if (this.quantityShipped > this.stockOnHand) {
                errors.quantityShipped = 'shipment.fillQuantityCannotExceedStockOnHand';
            }

            return angular.equals(errors, {}) ? undefined : errors;
        }
    }
})();