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
        .factory('CommodityTypeLineItem', CommodityTypeLineItem);

    CommodityTypeLineItem.inject = ['ShipmentViewLineItem', 'classExtender'];

    function CommodityTypeLineItem(ShipmentViewLineItem, classExtender) {

        classExtender.extend(CommodityTypeLineItem, ShipmentViewLineItem);

        CommodityTypeLineItem.prototype.getAvailableSoh = getAvailableSoh;
        CommodityTypeLineItem.prototype.getFillQuantity = getFillQuantity;

        return CommodityTypeLineItem;

        function CommodityTypeLineItem(summary, orderQuantity, tradeItemLineItems) {
            this.super(summary.orderable);

            this.isCommodityTypeLineItem = true;
            this.productCode = summary.orderable.productCode;
            this.productName = summary.orderable.fullProductName;
            this.orderQuantity = orderQuantity;
            this.availableSoh = summary.stockOnHand;
            this.tradeItemLineItems = tradeItemLineItems;
        }

        function getAvailableSoh(inDoses) {
            return this.tradeItemLineItems.reduce(function(availableSoh, lineItem) {
                return availableSoh + lineItem.getAvailableSoh(inDoses);
            }, 0);
        }

        function getFillQuantity() {
            return this.tradeItemLineItems.reduce(function(fillQuantity, lineItem) {
                return fillQuantity + lineItem.getFillQuantity();
            }, 0);
        }
    }

})();