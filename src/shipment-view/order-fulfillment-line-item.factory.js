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
        .factory('orderFulfillmentLineItemFactory', orderFulfillmentLineItemFactory);

    orderFulfillmentLineItemFactory.$inject = ['ShipmentLineItemWithSummary'];

    function orderFulfillmentLineItemFactory(ShipmentLineItemWithSummary) {
        var factory = {
            get: get
        };
        return factory;

        function get(order, shipmentDraft, stockCardSummaries) {
            var orderFulfillmentLineItems = [],
                shipmentDraftLineItems = [];

            shipmentDraft.lineItems.forEach(function(shipmentDraftLineItem) {
                var summary = filterByOrderableAndLot(
                    stockCardSummaries,
                    shipmentDraftLineItem.orderable,
                    shipmentDraftLineItem.lot
                )[0];

                shipmentDraftLineItems.push(new ShipmentLineItemWithSummary(
                    shipmentDraftLineItem.id,
                    summary,
                    shipmentDraftLineItem.quantityShipped
                ));
            });

            shipmentDraft.lineItems = shipmentDraftLineItems;
            shipmentDraft.lineItems.sort(compareLineItems);

            order.orderLineItems.forEach(function(orderLineItem) {
                orderFulfillmentLineItems.push(orderLineItem);

                filterByOrderableId(order.orderLineItems, order.orderable.id)
                .forEach(function(shipmentDraftLineItem) {
                    orderFulfillmentLineItems.push(shipmentDraftLineItem);
                });
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

        function filterByOrderableId(orderLineItems, orderableId) {
            return orderLineItems.filter(function(orderLineItem) {
                if (orderLineItem.orderable.id === orderableId) {
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
                compareExpirationDates(getExpirationDate(left), getExpirationDate(right)) ||
                compareStocksOnHands(left.summary.stockOnHand, right.summary.stockOnHand);
        }

        function compareVvmStatuses(left, right) {
            if (left === right) {
                return 0;
            }

            if (left && right) {
                if (left > right) {
                    return -1;
                }
                return 1;
            }

            if (!left) {
                return 1;
            }
            return -1;
        }

        function compareStocksOnHands(left, right) {
            if (left === right) {
                return 0;
            }

            if (left > right) {
                return 1;
            }
            return -1;
        }

        function compareExpirationDates(left, right) {
            if (left === right) {
                return 0;
            }

            if (left && right) {
                if (left > right) {
                    return 1;
                }
                return -1;
            }

            if (!left) {
                return -1;
            }
            return 1;
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
