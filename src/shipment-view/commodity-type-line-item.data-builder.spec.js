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
        .factory('CommodityTypeLineItemDataBuilder', CommodityTypeLineItemDataBuilder);

    CommodityTypeLineItemDataBuilder.inject = [
        'CommodityTypeLineItem', 'StockCardSummaryDataBuilder', 'TradeItemLineItemDataBuilder'
    ];

    function CommodityTypeLineItemDataBuilder(CommodityTypeLineItem, StockCardSummaryDataBuilder,
                                              TradeItemLineItemDataBuilder) {

        CommodityTypeLineItemDataBuilder.prototype.build = build;
        CommodityTypeLineItemDataBuilder.prototype.withSummary = withSummary;
        CommodityTypeLineItemDataBuilder.prototype.withOrderQuantity = withOrderQuantity;
        CommodityTypeLineItemDataBuilder.prototype.withTradeItemLineItems = withTradeItemLineItems;

        return CommodityTypeLineItemDataBuilder;

        function CommodityTypeLineItemDataBuilder() {
            CommodityTypeLineItemDataBuilder.instanceNumber =
                (CommodityTypeLineItemDataBuilder.instanceNumber || 0) + 1;

            this.summary = new StockCardSummaryDataBuilder().build();
            this.orderQuantity = 50;
            this.tradeItemLineItems = [
                new TradeItemLineItemDataBuilder().build(),
                new TradeItemLineItemDataBuilder().build()
            ];
        }

        function build() {
            return new CommodityTypeLineItem(
                this.summary,
                this.orderQuantity,
                this.tradeItemLineItems
            );
        }

        function withSummary(summary) {
            this.summary = summary;
            return this;
        }

        function withOrderQuantity(orderQuantity) {
            this.orderQuantity = orderQuantity;
            return this;
        }

        function withTradeItemLineItems(tradeItemLineItems) {
            this.tradeItemLineItems = tradeItemLineItems;
            return this;
        }

    }

})();