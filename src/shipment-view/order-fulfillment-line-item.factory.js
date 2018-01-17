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

    /**
     * @ngdoc service
     * @name shipment-view.orderFulfillmentLineItemFactory
     *
     * @description
     * Service for getting shipment (draft or finalized) based on order.
     */
    angular
        .module('shipment-view')
        .factory('orderFulfillmentLineItemFactory', orderFulfillmentLineItemFactory);

    orderFulfillmentLineItemFactory.$inject = ['ShipmentLineItemWithSummary', 'OrderLineItem'];

    function orderFulfillmentLineItemFactory(ShipmentLineItemWithSummary, OrderLineItem) {
        var factory = {
            get: get
        };
        return factory;

        /**
         * @ngdoc method
         * @methodOf shipment-view.shipmentFactory
         * @name getForOrder
         *
         * @description
         * Retrieves a shipment (draft or finalized) based on order status.
         *
         * @param  {Object}  order              order needed for screen
         * @param  {Object}  shipment           shipment for given order
         * @param  {Array}   stockCardSummaries stock card summaries for order supplying facility
         * @return {Promise}                    the promise resolving to a order line items
         */
        function get(order, shipment, stockCardSummaries) {
            var orderFulfillmentLineItems = [],
                shipmentLineItems = [];

            shipment.lineItems.forEach(function(shipmentLineItem) {
                var summary = filterByOrderableAndLot(
                    stockCardSummaries,
                    shipmentLineItem.orderable,
                    shipmentLineItem.lot
                )[0];

                shipmentLineItems.push(new ShipmentLineItemWithSummary(
                    shipmentLineItem.id,
                    summary,
                    shipmentLineItem.quantityShipped
                ));
            });

            shipment.lineItems = shipmentLineItems;
            shipment.lineItems.sort(compareLineItems);

            order.orderLineItems.forEach(function(orderLineItem) {
                orderFulfillmentLineItems.push(new OrderLineItem(
                    orderLineItem,
                    filterByOrderableId(
                        shipmentLineItems,
                        orderLineItem.orderable.id
                    )
                ));
            });

            return orderFulfillmentLineItems;
        }

        function filterByOrderableAndLot(stockCardSummaries, orderable, lot) {
            return stockCardSummaries.filter(function(summary) {
                if (summary.orderable.id === orderable.id && areLotsEqual(summary.lot, lot)) {
                    return true;
                }
                return false;
            });
        }

        function filterByOrderableId(shipmentLineItems, orderableId) {
            return shipmentLineItems.filter(function(shipmentLineItem) {
                if (shipmentLineItem.orderable.id === orderableId) {
                    return true;
                }
                return false;
            });
        }

        function areLotsEqual(left, right) {
            if (left && right && left.id === right.id) {
                return true;
            } else if (!left && !right)  {
                return true;
            }
            return false;
        }

        function compareLineItems(left, right) {
            return compareVvmStatuses(getVvmStatus(left), getVvmStatus(right)) ||
                compareExpirationDate(getExpirationDate(left), getExpirationDate(right)) ||
                compare(left.summary.stockOnHand, right.summary.stockOnHand);
        }

        function compareVvmStatuses(left, right) {
            return compare(left, right) * -1;
        }

        function compareExpirationDate(left, right) {
            return (left === undefined || left === null) && (right !== undefined || right != null) ? 1 :
                    (right === undefined || right === null ? -1 : compare(left, right));
        }

        function compare(left, right) {
            return left === right ? 0 : (left && right ? (left > right ? 1 : -1) : (left ? 1 : -1));
        }

        function getVvmStatus(lineItem) {
            if (lineItem.summary.extraData && lineItem.summary.extraData.vvmStatus) {
                return lineItem.summary.extraData.vvmStatus;
            }
        }

        function getExpirationDate(lineItem) {
            if (lineItem.lot && lineItem.lot.expirationDate) {
                return new Date(lineItem.lot.expirationDate).getTime();
            }
        }
    }

})();
