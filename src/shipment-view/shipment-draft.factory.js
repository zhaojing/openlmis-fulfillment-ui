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
        .factory('shipmentDraftFactory', shipmentDraftFactory);

    shipmentDraftFactory.$inject = ['shipmentService'];

    function shipmentDraftFactory(shipmentService) {
        var factory = {
            getForOrder: getForOrder
        };
        return factory;

        function getForOrder(order, stockCardSummaries) {
            if (!order) {
                throw 'Order must be defined';
            }

            return shipmentService.search({
                orderId: order.id
            })
            .then(function(result) {
                if (result.content.length) {
                    return result.content[0];
                }
                return buildShipmentFromOrderAndSummaries(order, stockCardSummaries);
            });
        }

        function buildShipmentFromOrderAndSummaries(order, stockCardSummaries) {
            var orderMatchingSummaries = filterByOrder(stockCardSummaries, order);

            var shipmentLineItems = [];
            orderMatchingSummaries.forEach(function(stockCardSummary) {
                shipmentLineItems.push({
                    orderable: stockCardSummary.orderable,
                    lot: stockCardSummary.lot,
                    quantityShipped: 0
                });
            });

            return {
                order: order,
                shipmentLineItems: shipmentLineItems
            };
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
    }

})();
