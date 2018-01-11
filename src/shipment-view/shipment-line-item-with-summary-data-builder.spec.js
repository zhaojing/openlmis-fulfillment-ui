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
        .factory('ShipmentLineItemWithSummaryDataBuilder', ShipmentLineItemWithSummaryDataBuilder);

    ShipmentLineItemWithSummaryDataBuilder.$inject = [
        'StockCardSummaryDataBuilder', 'ShipmentLineItemWithSummary'
    ];

    function ShipmentLineItemWithSummaryDataBuilder(StockCardSummaryDataBuilder,
                                                    ShipmentLineItemWithSummary) {

        ShipmentLineItemWithSummaryDataBuilder.prototype.withQuantityShipped = withQuantityShipped;
        ShipmentLineItemWithSummaryDataBuilder.prototype.build = build;

        return ShipmentLineItemWithSummaryDataBuilder;

        function ShipmentLineItemWithSummaryDataBuilder() {
            ShipmentLineItemWithSummaryDataBuilder.instanceNumber =
                (ShipmentLineItemWithSummaryDataBuilder.instanceNumber || 0) + 1;

            this.id = 'shipment-line-item-' + ShipmentLineItemWithSummaryDataBuilder.instanceNumber;
            this.summary = new StockCardSummaryDataBuilder().build();
            this.quantityShipped = 0;
        }

        function withQuantityShipped(quantityShipped) {
            this.quantityShipped = quantityShipped;
            return this;
        }

        function build() {
            return new ShipmentLineItemWithSummary(
                this.id,
                this.summary,
                this.quantityShipped
            );
        }
    }

})();
