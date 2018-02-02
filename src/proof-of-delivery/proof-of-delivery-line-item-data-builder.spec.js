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

    angular
        .module('proof-of-delivery')
        .factory('ProofOfDeliveryLineItemDataBuilder', ProofOfDeliveryLineItemDataBuilder);

    ProofOfDeliveryLineItemDataBuilder.$inject = ['ProofOfDeliveryLineItem'];

    function ProofOfDeliveryLineItemDataBuilder(ProofOfDeliveryLineItem) {

        ProofOfDeliveryLineItemDataBuilder.prototype.build = build;
        ProofOfDeliveryLineItemDataBuilder.prototype.buildJson = buildJson;

        return ProofOfDeliveryLineItemDataBuilder;

        function ProofOfDeliveryLineItemDataBuilder() {
            ProofOfDeliveryLineItemDataBuilder.instanceNumber =
                (ProofOfDeliveryLineItemDataBuilder.instanceNumber || 0) + 1;

            var instanceNumber = ProofOfDeliveryLineItemDataBuilder.instanceNumber;
            this.id = 'proof-of-delivery-line-item-id-' + instanceNumber;
            this.quantityShipped = 50 + instanceNumber;
            this.quantityReceived = this.quantityShipped - instanceNumber;
            this.quantityReturned = this.quantityShipped - this.quantityReceived;
            this.notes = 'Proof of Delivery ' + instanceNumber + ' notes.';
        }

        function build() {
            return new ProofOfDeliveryLineItem(this);
        }

        function buildJson() {
            return angular.copy(this);
        }

    }

})();
