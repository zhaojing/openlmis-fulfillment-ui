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
        .factory('ShipmentViewLineItem', ShipmentViewLineItem);

    ShipmentViewLineItem.inject = [];

    function ShipmentViewLineItem() {
        
        ShipmentViewLineItem.prototype.getAvailableSoh = throwMethodNotSupported;
        ShipmentViewLineItem.prototype.getFillQuantity = throwMethodNotSupported;
        ShipmentViewLineItem.prototype.getRemainingQuantity = getRemainingQuantity;

        return ShipmentViewLineItem;

        function ShipmentViewLineItem(orderable) {
            this.netContent = orderable.netContent;
        }

        function getRemainingQuantity(inDoses) {
            var remainingQuantity = this.getAvailableSoh() - this.getFillQuantity();

            if (inDoses) {
                return remainingQuantity * this.netContent;
            }
            return remainingQuantity;
        }
        
        function throwMethodNotSupported() {
            throw 'Method is not supported';
        }
    }

})();