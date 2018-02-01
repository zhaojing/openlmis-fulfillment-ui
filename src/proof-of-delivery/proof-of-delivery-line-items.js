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

        return ProofOfDeliveryLineItem;

        function ProofOfDeliveryLineItem(json) {
            angular.copy(json, this);
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery.ProofOfDeliveryLineItem
         * @name validate
         *
         * @description
         * Validates the line item and returns a list of errors.
         *
         * @return  {Object}    the map of errors
         */
        function validate() {
            var errors = {};

            if(this.quantityReceived === undefined || this.quantityReceived === null) {
                errors.quantityReceived = 'proofOfDeliveryView.required';
            }

            return angular.equals(errors, {}) ? undefined : errors;
        }
    }

})();
