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
     * Represents a single Proof of Delivery in the OpenLMIS system.
     */
    angular
        .module('proof-of-delivery')
        .factory('ProofOfDelivery', factory);

    factory.$inject = ['ProofOfDeliveryLineItem'];

    function factory(ProofOfDeliveryLineItem) {

        ProofOfDelivery.prototype.validate = validate;
        ProofOfDelivery.prototype.save = save;

        return ProofOfDelivery;

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery.ProofOfDelivery
         * @name ProofOfDelivery
         *
         * @description
         * Creates an instance of the ProofOfDelivery class.
         *
         * @param  {Object}                     json        the JSON representation of the Proof of
         *                                                  Delivery
         * @param  {ProofOfDeliveryRepository}  respository the instance of the
         *                                                  ProofOfDeliveryRepository class
         */
        function ProofOfDelivery(json, repository) {
            angular.copy(json, this);
            this.repository = repository;
            this.lineItems = createLineItems(json.lineItems, json.shipment.lineItems);
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery.ProofOfDelivery
         * @name saved
         *
         * @description
         * Updates the Proof of Delivery in the repository.
         *
         * @return {Promise}    the promise resolved when save was successful or rejected if it was
         *                      not
         */
        function save() {
            return this.repository.update(this);
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery.ProofOfDelivery
         * @name validate
         *
         * @description
         * Validates the Proof of Delivery and returns a map of errors if it is invalid.
         *
         * @return {Object} the map of errors if the Proof of Delivery is invalid, undefined
         *                  otherwise
         */
        function validate() {
            var errors = {};

            verifyNotEmpty(errors, this.receivedBy, 'receivedBy');
            verifyNotEmpty(errors, this.deliveredBy, 'deliveredBy');
            verifyNotEmpty(errors, this.receivedDate, 'receivedDate');

            validateLineItems(errors, this);

            return angular.equals(errors, {}) ? undefined : errors;
        }

        function createLineItems(jsonLineItems, shipmentLineItems) {
            var lineItems = [];
            jsonLineItems.forEach(function(lineItem) {
                var quantityShipped = shipmentLineItems.filter(function(shipmentLineItem) {
                    return shipmentLineItem.orderable.id === lineItem.orderable.id &&
                        shipmentLineItem.lot.id === lineItem.lot.id;
                })[0].quantityShipped;
                lineItems.push(new ProofOfDeliveryLineItem(lineItem, quantityShipped));
            });
            return lineItems;
        }

        function validateLineItems(errors, proofOfDelivery) {
            var lineItemsErrors = [];
            proofOfDelivery.lineItems.forEach(function(lineItem) {
                var lineItemErrors = lineItem.validate();

                if (lineItemErrors) {
                    lineItemsErrors.push(lineItemErrors);
                }
            });

            if (lineItemsErrors.length) {
                errors.lineItems = lineItemsErrors;
            }
        }

        function verifyNotEmpty(errors, value, fieldName) {
            if (!value || value === '') {
                errors[fieldName] = 'proofOfDelivery.required';
            }
        }
    }

})();
