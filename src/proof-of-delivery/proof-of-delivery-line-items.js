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
     * @name proof-of-delivery.ProofOfDeliveryLineItem
     *
     * @description
     * Represents a single line item of Proof of Delivery.
     */
    angular
        .module('proof-of-delivery')
        .factory('ProofOfDeliveryLineItem', ProofOfDeliveryLineItem);

    function ProofOfDeliveryLineItem() {

        ProofOfDeliveryLineItem.prototype.validate = validate;
        ProofOfDeliveryLineItem.prototype.updateQuantityReturned = updateQuantityReturned;

        return ProofOfDeliveryLineItem;

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery.ProofOfDeliveryLineItem
         * @name ProofOfDeliveryLineItem
         * @constructor
         *
         * @description
         * Creates an instance of ProofOfDeliveryLineItem class.
         *
         * @param   {Object}    json    the JSON to build the instance
         */
        function ProofOfDeliveryLineItem(json) {
            angular.copy(json, this);
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery.ProofOfDeliveryLineItem
         * @name updateQuantityReturned
         *
         * @description
         * Updates the quantity returned based on the set quantity received.
         */
        function updateQuantityReturned() {
            if (!this.quantityReceived && this.quantityReceived !== 0) {
                this.quantityReturned = undefined;
            } else {
                var quantityReturned = this.quantityShipped - this.quantityReceived;

                if (quantityReturned < 0) {
                    this.quantityReturned = 0;
                } else if (quantityReturned > this.quantityShipped) {
                    this.quantityReturned = this.quantityShipped
                } else {
                    this.quantityReturned = quantityReturned;
                }
            }
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery.ProofOfDeliveryLineItem
         * @name validate
         *
         * @description
         * Validates the line item and returns a map of errors.
         *
         * @return  {Object}    the map of errors
         */
        function validate() {
            var errors = {};

            if(this.quantityReceived === undefined || this.quantityReceived === null) {
                errors.quantityReceived = 'proofOfDelivery.required';
            }

            if (this.quantityReceived < 0) {
                errors.quantityReceived = 'proofOfDelivery.positive';
            }

            if (this.quantityShipped < this.quantityReceived) {
                errors.quantityReceived = 'proofOfDelivery.canNotAcceptMoreThanShipped';
            }

            return angular.equals(errors, {}) ? undefined : errors;
        }
    }

})();
