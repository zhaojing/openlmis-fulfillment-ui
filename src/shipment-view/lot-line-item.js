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
        .factory('LotLineItem', LotLineItem);

    LotLineItem.inject = ['ShipmentViewLineItem', 'classExtender'];

    function LotLineItem(ShipmentViewLineItem, classExtender) {

        classExtender.extend(LotLineItem, ShipmentViewLineItem);

        LotLineItem.prototype.getAvailableSoh = getAvailableSoh;
        LotLineItem.prototype.getFillQuantity = getFillQuantity;

        return LotLineItem;

        function LotLineItem(canFulfillForMe, shipmentLineItem) {
            this.super(canFulfillForMe.orderable);

            this.isLotLineItem = true;
            this.lot = canFulfillForMe.lot;
            this.shipmentLineItem = shipmentLineItem;
        }

        function getAvailableSoh(inDoses) {
            return this.recalculateQuantity(this.shipmentLineItem.stockOnHand, inDoses);
        }

        function getFillQuantity() {
            return this.shipmentLineItem.quantityShipped || 0;
        }
    }

})();