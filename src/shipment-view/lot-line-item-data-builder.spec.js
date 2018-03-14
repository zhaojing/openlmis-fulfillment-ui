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
        .module('shipment-view')
        .factory('LotLineItemDataBuilder', LotLineItemDataBuilder);

    LotLineItemDataBuilder.inject = [
        'LotLineItem', 'ShipmentLineItemDataBuilder', 'CanFulfillForMeEntryDataBuilder',
        'OrderableDataBuilder'
    ];

    function LotLineItemDataBuilder(LotLineItem, ShipmentLineItemDataBuilder,
        CanFulfillForMeEntryDataBuilder, OrderableDataBuilder) {

        LotLineItemDataBuilder.prototype.build = build;
        LotLineItemDataBuilder.prototype.withAvailableSoh = withAvailableSoh;
        LotLineItemDataBuilder.prototype.withNetContent = withNetContent;
        LotLineItemDataBuilder.prototype.withShipmentLineItem = withShipmentLineItem;

        return LotLineItemDataBuilder;

        function LotLineItemDataBuilder() {
            this.canFulfillForMe = new CanFulfillForMeEntryDataBuilder().buildJson();
            this.shipmentLineItem = new ShipmentLineItemDataBuilder().build();
        }

        function build() {
            return new LotLineItem(this.canFulfillForMe, this.shipmentLineItem);
        }

        function withAvailableSoh(availableSoh) {
            this.shipmentLineItem = new ShipmentLineItemDataBuilder()
                .withCanFulfillForMe(
                    new CanFulfillForMeEntryDataBuilder()
                    .withStockOnHand(availableSoh)
                    .withLot(this.canFulfillForMe.lot)
                    .withOrderable(this.canFulfillForMe.orderable)
                    .buildJson()
                )
                .withQuantityShipped(this.shipmentLineItem.quantityShipped)
                .build();

            return this;
        }

        function withNetContent(netContent) {
            this.canFulfillForMe = new CanFulfillForMeEntryDataBuilder()
                .withStockOnHand(this.canFulfillForMe.stockOnHand)
                .withLot(this.canFulfillForMe.lot)
                .withOrderable(new OrderableDataBuilder()
                    .withNetContent(netContent)
                    .buildJson()
                )
                .buildJson();

            return this;
        }

        function withShipmentLineItem(shipmentLineItem) {
            this.shipmentLineItem = shipmentLineItem;
            return this;
        }

    }

})();