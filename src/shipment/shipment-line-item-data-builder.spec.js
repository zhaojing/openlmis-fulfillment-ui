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
        .module('shipment')
        .factory('ShipmentLineItemDataBuilder', ShipmentLineItemDataBuilder);

    ShipmentLineItemDataBuilder.$inject = [
        'ShipmentLineItem', 'ObjectReferenceDataBuilder', 'CanFulfillForMeEntryDataBuilder',
        'OrderableDataBuilder'
    ];

    function ShipmentLineItemDataBuilder(ShipmentLineItem, ObjectReferenceDataBuilder,
        CanFulfillForMeEntryDataBuilder, OrderableDataBuilder) {

        ShipmentLineItemDataBuilder.buildForProofOfDeliveryLineItem =
            buildForProofOfDeliveryLineItem;

        ShipmentLineItemDataBuilder.prototype.build = build;
        ShipmentLineItemDataBuilder.prototype.buildJson = buildJson;

        ShipmentLineItemDataBuilder.prototype.withOrderable = withOrderable;
        ShipmentLineItemDataBuilder.prototype.withLot = withLot;
        ShipmentLineItemDataBuilder.prototype.withQuantityShipped = withQuantityShipped;
        ShipmentLineItemDataBuilder.prototype.withoutLot = withoutLot;
        ShipmentLineItemDataBuilder.prototype.withCanFulfillForMe = withCanFulfillForMe;

        return ShipmentLineItemDataBuilder;

        function ShipmentLineItemDataBuilder() {
            ShipmentLineItemDataBuilder.instanceNumber =
                (ShipmentLineItemDataBuilder.instanceNumber || 0) + 1;

            this.id = 'shipment-line-item-' + ShipmentLineItemDataBuilder.instanceNumber;
            this.orderable = new ObjectReferenceDataBuilder()
                .withResource('orderable')
                .build();

            this.lot = new ObjectReferenceDataBuilder()
                .withResource('lot')
                .build();

            this.quantityShipped = 0;
            this.canFulfillForMe = new CanFulfillForMeEntryDataBuilder()
                .withOrderable(
                    new OrderableDataBuilder()
                    .withNetContent(1)
                    .buildJson()
                )
                .buildJson();
        }

        function build() {
            return new ShipmentLineItem(this.buildJson());
        }

        function buildJson() {
            return {
                id: this.id,
                orderable: this.orderable,
                lot: this.lot,
                quantityShipped: this.quantityShipped,
                canFulfillForMe: this.canFulfillForMe
            };
        }

        function withOrderable(orderable) {
            this.orderable = orderable;
            return this;
        }

        function withLot(lot) {
            this.lot = lot;
            return this;
        }

        function withoutLot() {
            this.lot = undefined;
            return this;
        }

        function withQuantityShipped(quantityShipped) {
            this.quantityShipped = quantityShipped;
            return this;
        }

        function buildForProofOfDeliveryLineItem(proofOfDeliveryLineItem) {
            return new ShipmentLineItemDataBuilder()
                .withOrderable(proofOfDeliveryLineItem.orderable)
                .withLot(proofOfDeliveryLineItem.lot)
                .withQuantityShipped(proofOfDeliveryLineItem.quantityAccepted +
                    proofOfDeliveryLineItem.quantityRejected)
                .buildJson();
        }

        function withCanFulfillForMe(canFulfillForMe) {
            this.canFulfillForMe = canFulfillForMe;
            return this;
        }

    }

})();