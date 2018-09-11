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
        .factory('ProofOfDeliveryDataBuilder', ProofOfDeliveryDataBuilder);

    ProofOfDeliveryDataBuilder.$inject = [
        'ProofOfDelivery', 'ProofOfDeliveryLineItemDataBuilder', 'ObjectReferenceDataBuilder',
        'ShipmentDataBuilder', 'ShipmentLineItemDataBuilder', 'PROOF_OF_DELIVERY_STATUS'
    ];

    function ProofOfDeliveryDataBuilder(ProofOfDelivery, ProofOfDeliveryLineItemDataBuilder,
                                        ObjectReferenceDataBuilder, ShipmentDataBuilder,
                                        ShipmentLineItemDataBuilder, PROOF_OF_DELIVERY_STATUS) {

        ProofOfDeliveryDataBuilder.prototype.build = build;
        ProofOfDeliveryDataBuilder.prototype.buildJson = buildJson;
        ProofOfDeliveryDataBuilder.prototype.withReceivedDate = withReceivedDate;
        ProofOfDeliveryDataBuilder.prototype.withLineItems = withLineItems;

        return ProofOfDeliveryDataBuilder;

        function ProofOfDeliveryDataBuilder() {
            ProofOfDeliveryDataBuilder.instanceNumber =
                (ProofOfDeliveryDataBuilder.instanceNumber || 0) + 1;

            var instanceNumber = ProofOfDeliveryDataBuilder.instanceNumber;
            this.id = 'proof-of-delivery-id-' + instanceNumber;
            this.status = PROOF_OF_DELIVERY_STATUS.INITIATED;
            this.deliveredBy = 'Deliverer ' + instanceNumber;
            this.receivedBy = 'Receiver ' + instanceNumber;
            this.receivedDate = '2018-02-01';
            this.shipment = new ObjectReferenceDataBuilder().build();

            this.lineItems = [
                new ProofOfDeliveryLineItemDataBuilder().buildJson(),
                new ProofOfDeliveryLineItemDataBuilder().buildJson()
            ];
        }

        function build() {
            return new ProofOfDelivery(this.buildJson());
        }

        function buildJson() {
            return {
                id: this.id,
                shipment: this.shipment,
                status: this.status,
                lineItems: this.lineItems,
                deliveredBy: this.deliveredBy,
                receivedBy: this.receivedBy,
                receivedDate: this.receivedDate
            };
        }

        function withReceivedDate(receivedDate) {
            this.receivedDate = receivedDate;
            return this;
        }

        function withLineItems(lineItems) {
            this.lineItems = lineItems;
            return this;
        }

    }

})();
