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
        .module('order-details')
        .factory('OrderWithStockSummaries', OrderWithStockSummaries);

    OrderWithStockSummaries.$inject = ['Order', 'OrderLineItemWithSummaries'];

    function OrderWithStockSummaries(Order, OrderLineItemWithSummaries) {

        OrderWithStockSummaries.fromOrderAndSummaries = fromOrderAndSummaries;

        return OrderWithStockSummaries;

        function OrderWithStockSummaries(id, emergency, createdDate, program, requestingFacility,
                                         orderCode, status, orderLineItems, processingPeriod,
                                         lastUpdatedDate, facility, receivingFacility,
                                         supplyingFacility, lastUpdater, stockCardSummaries) {

            var orderLineItemsWithSummaries = [];

            orderLineItems.forEach(function(orderLineItem) {
                var orderableSummaries = filterByOrderable(
                    stockCardSummaries,
                    orderLineItem.orderable
                ),

                orderLineItemWithSummaries = OrderLineItemWithSummaries.fromOrderLineItemAndSummaries(
                    orderLineItem,
                    orderableSummaries
                );

                orderLineItemsWithSummaries.push(orderLineItemWithSummaries);
            });

            Order.call(
                this, id, emergency, createdDate, program, requestingFacility, orderCode, status,
                orderLineItemsWithSummaries, processingPeriod, lastUpdatedDate, facility,
                receivingFacility, supplyingFacility, lastUpdater
            );
        }

        function fromOrderAndSummaries(order, summaries) {
            return new OrderWithStockSummaries(
                order.id,
                order.emergency,
                order.createdDate,
                order.program,
                order.requestingFacility,
                order.orderCode,
                order.status,
                order.orderLineItems,
                order.processingPeriod,
                order.lastUpdatedDate,
                order.facility,
                order.receivingFacility,
                order.supplyingFacility,
                order.lastUpdater,
                summaries
            );
        }

        function filterByOrderable(summaries, orderable) {
            return summaries.filter(function(summary) {
                return summary.orderable.id === orderable.id;
            });
        }

    }

})();
