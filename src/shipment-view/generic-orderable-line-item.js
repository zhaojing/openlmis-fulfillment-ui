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
        .factory('GenericOrderableLineItem', GenericOrderableLineItem);

    GenericOrderableLineItem.inject = ['ShipmentViewLineItem', 'classExtender'];

    function GenericOrderableLineItem(ShipmentViewLineItem, classExtender) {

        classExtender.extend(GenericOrderableLineItem, ShipmentViewLineItem);

        GenericOrderableLineItem.prototype.getAvailableSoh = getAvailableSoh;
        GenericOrderableLineItem.prototype.getFillQuantity = getFillQuantity;
        GenericOrderableLineItem.prototype.getOrderQuantity = getOrderQuantity;

        return GenericOrderableLineItem;

        function GenericOrderableLineItem(summary, orderQuantity, shipmentLineItem) {
            this.super(summary.orderable);
            this.productCode = summary.orderable.productCode;
            this.productName = summary.orderable.fullProductName;
            this.orderQuantity = orderQuantity;
            this.shipmentLineItem = shipmentLineItem;
        }

        function getAvailableSoh(inDoses) {
            return this.recalculateQuantity(this.shipmentLineItem.stockOnHand, inDoses);
        }

        function getOrderQuantity(inDoses) {
            return this.recalculateQuantity(this.orderQuantity, inDoses);
        }

        function getFillQuantity() {
            return this.shipmentLineItem.quantityShipped;
        }

    }

})();