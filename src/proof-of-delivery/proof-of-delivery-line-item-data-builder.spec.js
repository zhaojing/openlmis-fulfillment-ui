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

    ProofOfDeliveryLineItemDataBuilder.$inject = [
        'ProofOfDeliveryLineItem', 'ObjectReferenceDataBuilder', 'ShipmentLineItemDataBuilder'
    ];

    function ProofOfDeliveryLineItemDataBuilder(ProofOfDeliveryLineItem, ObjectReferenceDataBuilder,
                                                ShipmentLineItemDataBuilder) {

        ProofOfDeliveryLineItemDataBuilder.prototype.build = build;
        ProofOfDeliveryLineItemDataBuilder.prototype.buildJson = buildJson;
        ProofOfDeliveryLineItemDataBuilder.prototype.withQuantityAccepted = withQuantityAccepted;
        ProofOfDeliveryLineItemDataBuilder.prototype.withQuantityRejected = withQuantityRejected;
        ProofOfDeliveryLineItemDataBuilder.prototype.withQuantityShipped = withQuantityShipped;
        ProofOfDeliveryLineItemDataBuilder.prototype.withOrderable = withOrderable;
        ProofOfDeliveryLineItemDataBuilder.prototype.withLot = withLot;

        return ProofOfDeliveryLineItemDataBuilder;

        function ProofOfDeliveryLineItemDataBuilder() {
            ProofOfDeliveryLineItemDataBuilder.instanceNumber =
                (ProofOfDeliveryLineItemDataBuilder.instanceNumber || 0) + 1;

            var instanceNumber = ProofOfDeliveryLineItemDataBuilder.instanceNumber;
            this.id = 'proof-of-delivery-line-item-id-' + instanceNumber;
            this.orderable = new ObjectReferenceDataBuilder().build();
            this.lot = new ObjectReferenceDataBuilder().build();
            this.quantityAccepted = 50 + instanceNumber;
            this.quantityRejected = 50;
            this.notes = 'Proof of Delivery line item' + instanceNumber + ' notes.';
            this.shipmentLineItem = new ShipmentLineItemDataBuilder()
                .withQuantityShipped(this.quantityAccepted + this.quantityRejected)
                .build();
        }

        function build() {
            return new ProofOfDeliveryLineItem(this.buildJson(), this.shipmentLineItem);
        }

        function buildJson() {
            return {
                id: this.id,
                orderable: this.orderable,
                lot: this.lot,
                quantityAccepted: this.quantityAccepted,
                quantityRejected: this.quantityRejected,
                notes: this.notes,
            }
        }

        function withQuantityAccepted(quantityAccepted) {
            this.quantityAccepted = quantityAccepted;
            return this;
        }

        function withQuantityRejected(quantityRejected) {
            this.quantityRejected = quantityRejected;
            return this;
        }

        function withQuantityShipped(quantityShipped) {
            this.shipmentLineItem.quantityShipped = quantityShipped;
            return this;
        }

        function withOrderable(orderable) {
            this.orderable = orderable
            return this;
        }

        function withLot(lot) {
            this.lot = lot;
            return this;
        }

    }

})();
