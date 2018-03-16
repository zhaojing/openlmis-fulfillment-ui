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
        .factory('ShipmentViewLineItemGroup', ShipmentViewLineItemGroup);

    ShipmentViewLineItemGroup.inject = [];

    function ShipmentViewLineItemGroup() {

        ShipmentViewLineItemGroup.prototype.getAvailableSoh = getAvailableSoh;
        ShipmentViewLineItemGroup.prototype.getFillQuantity = getFillQuantity;
        ShipmentViewLineItemGroup.prototype.getRemainingQuantity = getRemainingQuantity;
        ShipmentViewLineItemGroup.prototype.recalculateQuantity = recalculateQuantity;
        ShipmentViewLineItemGroup.prototype.getOrderQuantity = getOrderQuantity;

        return ShipmentViewLineItemGroup;

        function ShipmentViewLineItemGroup(config) {
            this.productCode = config.productCode;
            this.productName = config.productName;
            this.orderQuantity = config.orderQuantity;
            this.lineItems = config.lineItems;
            this.netContent = config.netContent;
            this.isMainGroup = config.isMainGroup;
            this.noStockAvailable = this.getAvailableSoh() === 0;
        }

        function getAvailableSoh(inDoses) {
            return this.lineItems.reduce(function(availableSoh, lineItem) {
                return availableSoh + lineItem.getAvailableSoh(inDoses);
            }, 0);
        }

        function getFillQuantity() {
            return this.lineItems.reduce(function(fillQuantity, lineItem) {
                return fillQuantity + lineItem.getFillQuantity();
            }, 0);
        }

        function getRemainingQuantity(inDoses) {
            var remainingQuantity = this.getAvailableSoh() - this.getFillQuantity();

            if (inDoses) {
                return remainingQuantity * this.netContent;
            }
            return remainingQuantity;
        }

        function getOrderQuantity(inDoses) {
            if (!this.orderQuantity) {
                return;
            }
            return this.recalculateQuantity(this.orderQuantity, inDoses);
        }

        function recalculateQuantity(quantity, inDoses) {
            if (inDoses) {
                return quantity * this.netContent;
            }
            return quantity;
        }
    }

})();