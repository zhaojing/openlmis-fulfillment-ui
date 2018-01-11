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
     * @name shipment-view.ShipmentLineItemWithSummary
     *
     * @description
     * Represents a single shipment line item extended by the stock card summary for the orderable
     * and lot.
     */
    angular
        .module('shipment-view')
        .factory('ShipmentLineItemWithSummary', ShipmentLineItemWithSummary);

    ShipmentLineItemWithSummary.$inject = [];

    function ShipmentLineItemWithSummary() {

        ShipmentLineItemWithSummary.prototype.validate = validate;

        return ShipmentLineItemWithSummary;

        /**
         * @ngdoc method
         * @methodOf shipment-view.ShipmentLineItemWithSummary
         * @name ShipmentLineItemWithSummary
         *
         * @description
         * Creates instance of the ShipmentLineItemWithSummary class.
         *
         * @param       {string}    id              the ID of the line item
         * @param       {Object}    summary         the stock card summary matching orderable and lot
         * @param       {number}    quantityShipped the shipped quantity
         */
        function ShipmentLineItemWithSummary(id, summary, quantityShipped) {
            this.id = id;
            this.summary = summary;
            this.orderable = summary.orderable;
            this.lot = summary.lot;
            this.quantityShipped = quantityShipped;
        }

        /**
         * @ngdoc methodOf
         * @methodOf shipment-view.ShipmentLineItemWithSummary
         * @name validate
         *
         * @description
         * Validates the shipment line items and places any errors in an object under 'errors'
         * property.
         */
        function validate() {
            this.errors = {};

            if (this.quantityShipped > this.summary.stockOnHand) {
                this.errors.quantityShipped = 'shipmentView.fillQuantityCannotExceedStockOnHand';
            }
        }
    }

})();
