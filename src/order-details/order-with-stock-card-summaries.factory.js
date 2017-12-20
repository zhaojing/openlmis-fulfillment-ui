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
     * @name order-details.orderWithStockCardSummariesFactory
     *
     * @description
     * Adds stock cards summaries info to order.
     */
    angular
        .module('order-details')
        .factory('orderWithStockCardSummariesFactory', orderWithStockCardSummariesFactory);

    orderWithStockCardSummariesFactory.$inject = ['basicOrderFactory', 'orderService', 'stockCardSummariesService'];

    function orderWithStockCardSummariesFactory(basicOrderFactory, orderService, stockCardSummariesService) {
        var orderWithSummariesFactory = {
            getOrderWithSummaries: getOrderWithSummaries
        };
        return orderWithSummariesFactory;

        /**
         * @ngdoc method
         * @methodOf order-details.orderWithStockCardSummariesFactory
         * @name getOrderWithSummaries
         *
         * @description
         * Adds stock cards summaries info to order.
         *
         * @param  {String}  orderId the UUID of an order
         * @return {Promise}         the order with stock card summaries
         */
        function getOrderWithSummaries(orderId) {
            return orderService.get(orderId, 'lastUpdater')
            .then(function(orderResponse) {
                return stockCardSummariesService.getStockCardSummaries(orderResponse.program.id, orderResponse.facility.id)
                .then(function(stockCardSummariesResponse) {
                    return buildOrder(orderResponse, stockCardSummariesResponse);
                });
            });
        }

        function buildOrder(orderResponse, stockCardSummaries) {
            var orderLineItemsWithSummaries = buildOrderLineItemsWithSummaries(orderResponse.orderLineItems, stockCardSummaries),
                order = basicOrderFactory.buildFromResponse(orderResponse);

            order.orderLineItems = orderLineItemsWithSummaries;

            return order;
        }

        function buildOrderLineItemsWithSummaries(orderLineItems, stockCardSummaries) {
            var orderLineItemsWithSummaries = [];

            orderLineItems.forEach(function(orderLineItem) {
                var orderableSummaries = filterByOrderable(stockCardSummaries, orderLineItem.orderable);

                orderLineItemsWithSummaries.push({
                    id: orderLineItem.id,
                    filledQuantity: orderLineItem.filledQuantity,
                    orderable: orderLineItem.orderable,
                    orderedQuantity: orderLineItem.orderedQuantity,
                    packsToShip: orderLineItem.packsToShip,
                    summaries: orderableSummaries
                });
            });

            return orderLineItemsWithSummaries;
        }

        function filterByOrderable(summaries, orderable) {
            return summaries.filter(function(summary) {
                return summary.orderable.id === orderable.id;
            });
        }
    }

})();
