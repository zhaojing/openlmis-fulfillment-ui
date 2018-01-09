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
     * @name shipment-view.shipmentWithStockCardSummariesFactory
     *
     * @description
     * Adds stock cards summaries info to shipment line items.
     */
    angular
        .module('shipment-view')
        .factory('shipmentWithStockCardSummariesFactory', shipmentWithStockCardSummariesFactory);

    shipmentWithStockCardSummariesFactory.$inject = [
        '$q', 'orderService', 'shipmentService', 'stockCardSummariesService',
        'ShipmentLineItemWithSummary', 'OrderLineItem'
    ];

    function shipmentWithStockCardSummariesFactory($q, orderService, shipmentService,
                                                   stockCardSummariesService,
                                                   ShipmentLineItemWithSummary,
                                                   OrderLineItem) {
        var factory = {
            get: get
        };
        return factory;

        /**
         * @ngdoc method
         * @methodOf shipment-view.shipmentWithStockCardSummariesFactory
         * @name get
         *
         * @description
         * Build a shipment including information about stock card summaries for order with the
         * given ID.
         *
         * @param   {string}    orderId the ID of the order
         * @return  {Promise}           the promise resolving to shipment
         */
        function get(orderId) {
            if (!orderId) {
                throw 'Order ID must be defined';
            }

            return $q.all([
                orderService.get(orderId),
                shipmentService.search({
                    orderId: orderId
                })
            ])
            .then(function(responses) {
                var order = responses[0];
                return stockCardSummariesService.getStockCardSummaries(
                    order.program.id,
                    order.supplyingFacility.id
                )
                .then(function(stockCardSummaries) {
                    var shipment = extractShipmentFromResponse(responses[1]);
                    return buildShipmentWithStockCardSummaries(order, stockCardSummaries, shipment);
                });
            });
        }

        function buildShipmentWithStockCardSummaries(order, stockCardSummaries, shipment) {
            var shipmentLineItems;
            if (shipment) {
                shipmentLineItems = buildLineItemsFromSummariesAndShipment(
                    stockCardSummaries, shipment
                );
            } else {
                shipment = {};
                shipmentLineItems = buildLineItemsFromSummariesAndOrder(
                    stockCardSummaries, order
                );
            }

            shipment.order = order;
            shipment.lineItems = shipmentLineItems;

            addShipmentLineItemReferencesToOrder(shipment);

            return shipment;
        }

        function addShipmentLineItemReferencesToOrder(shipment) {
            var orderLineItems = [];
            shipment.order.orderLineItems.forEach(function(orderLineItem) {
                orderLineItems.push(new OrderLineItem(
                    orderLineItem,
                    filterByOrderableId(
                        shipment.lineItems,
                        orderLineItem.orderable.id
                    )
                ));
            });
            shipment.order.orderLineItems = orderLineItems;
        }

        function buildLineItemsFromSummariesAndShipment(stockCardSummaries, shipment) {
            var shipmentLineItems = [];
            shipment.lineItems.forEach(function(lineItem) {
                var stockCardSummary = filterByOrderableAndLot(
                    stockCardSummaries,
                    lineItem.orderable,
                    lineItem.lot
                )[0];

                shipmentLineItems.push(new ShipmentLineItemWithSummary(
                    stockCardSummary,
                    lineItem.shippedQuantity
                ));
            });

            return shipmentLineItems;
        }

        function buildLineItemsFromSummariesAndOrder(stockCardSummaries, order) {
            var orderMatchingSummaries = filterByOrder(stockCardSummaries, order);

            var shipmentLineItems = [];
            orderMatchingSummaries.forEach(function(stockCardSummary) {
                shipmentLineItems.push(new ShipmentLineItemWithSummary(
                    stockCardSummary,
                    0
                ));
            });

            return shipmentLineItems;
        }

        function filterByOrderableAndLot(stockCardSummaries, orderable, lot) {
            return stockCardSummaries.filter(function(summary) {
                if (summary.orderable.id === orderable.id && areLotsEqual(summary.lot, lot)) {
                    return true;
                }
                return false;
            });
        }

        function filterByOrder(stockCardSummaries, order) {
            return stockCardSummaries.filter(function(stockCardSummary) {
                return filterByOrderableId(
                    order.orderLineItems,
                    stockCardSummary.orderable.id
                ).length > 0;
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

        function extractShipmentFromResponse(response) {
            if (response.content.length) {
                return response.content[0];
            }
            return undefined;
        }

        function areLotsEqual(left, right) {
            if (left && right && left.id === right.id) {
                return true;
            } else if (!left && !right)  {
                return true;
            }
            return false;
        }
    }

})();
