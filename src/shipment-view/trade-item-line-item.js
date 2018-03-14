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
        .factory('TradeItemLineItem', TradeItemLineItem);

    TradeItemLineItem.inject = ['ShipmentViewLineItem', 'classExtender'];

    function TradeItemLineItem(ShipmentViewLineItem, classExtender) {

        classExtender.extend(TradeItemLineItem, ShipmentViewLineItem);

        TradeItemLineItem.prototype.getAvailableSoh = getAvailableSoh;
        TradeItemLineItem.prototype.getFillQuantity = getFillQuantity;

        return TradeItemLineItem;

        function TradeItemLineItem(orderable, lotLineItems) {
            this.super(orderable);
            
            this.productCode = orderable.productCode;
            this.productName = orderable.fullProductName;
            this.lotLineItems = lotLineItems;
        }

        function getAvailableSoh(inDoses) {
            return this.lotLineItems.reduce(function(availableSoh, lineItem) {
                return availableSoh + lineItem.getAvailableSoh(inDoses);
            }, 0);
        }

        function getFillQuantity() {
            return this.lotLineItems.reduce(function(fillQuantity, lineItem) {
                return fillQuantity + lineItem.getFillQuantity();
            }, 0);
        }
    }

})();