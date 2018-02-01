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

(function(){

    'use strict';

    /**
     * @ngdoc service
     * @name proof-of-delivery.ProofOfDelivery
     *
     * @description
     * Responsible for supplying pod with additional methods and information.
     */
    angular
        .module('proof-of-delivery')
        .factory('ProofOfDelivery', factory);

    factory.$inject = ['ProofOfDeliveryLineItem', 'dateUtils'];

    function factory(ProofOfDeliveryLineItem, dateUtils) {

        ProofOfDelivery.prototype.validate = validate;

        return ProofOfDelivery;


        /**
         * @ngdoc method
         * @methodOf proof-of-delivery.ProofOfDelivery
         * @name ProofOfDelivery
         *
         * @description
         * Adds all needed methods and information to given ProofOfDelivery.
         *
         * @param  {Resource}        source ProofOfDelivery object
         * @param  {Resource}        order  Order with additional info
         * @return {ProofOfDelivery}        Proof Of Delivery object
         */
        function ProofOfDelivery(json) {
            angular.copy(json, this);

            this.receivedDate = dateUtils.toDate(json.receivedDate);

            var proofOfDeliveryLineItems = [];
            json.proofOfDeliveryLineItems.forEach(function(lineItem) {
                proofOfDeliveryLineItems.push(new ProofOfDeliveryLineItem(lineItem));
            });

            this.proofOfDeliveryLineItems = proofOfDeliveryLineItems;
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery.ProofOfDelivery
         * @name isValid
         *
         * @description
         * Checks if POD is valid.
         *
         * @return {Boolean} true if POD is valid, false otherwise
         */
        function validate() {
            var errors = {};

            verifyNotEmpty(errors, this.receivedBy, 'receivedBy');
            verifyNotEmpty(errors, this.deliveredBy, 'deliveredBy');
            verifyNotEmpty(errors, this.receivedDate, 'receivedDate');

            var proofOfDeliveryLineItemsErrors = [];
            this.proofOfDeliveryLineItems.forEach(function(lineItem) {
                var lineItemErrors = lineItem.validate();

                if (lineItemErrors) {
                    proofOfDeliveryLineItemsErrors.push(lineItemErrors);
                }
            });

            if (proofOfDeliveryLineItemsErrors.length) {
                errors.proofOfDeliveryLineItems = proofOfDeliveryLineItemsErrors;
            }

            return angular.equals(errors, {}) ? undefined : errors;
        }

        function verifyNotEmpty(errors, value, fieldName) {
            if (!value || value === '') {
                errors[fieldName] = 'proofOfDeliveryView.required';
            }
        }
    }

})();
