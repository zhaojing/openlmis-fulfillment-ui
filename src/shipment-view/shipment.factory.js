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
     * @name shipment-view.shipmentFactory
     *
     * @description
     * Service for getting shipment (draft or finalized) based on order.
     */
    angular
        .module('shipment-view')
        .factory('shipmentFactory', shipmentFactory);

    shipmentFactory.$inject = ['shipmentService', 'shipmentDraftService', 'ORDER_STATUS'];

    function shipmentFactory(shipmentService, shipmentDraftService, ORDER_STATUS) {
        var factory = {
            getForOrder: getForOrder
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
         * @param  {Object}  order              order that we want to get shipment for
         * @param  {Array}   stockCardSummaries stock card summaries for order supplying facility
         * @return {Promise}                    the promise resolving to a shipment
         */
        function getForOrder(order, stockCardSummaries) {
            if (!order) {
                throw 'Order must be defined';
            }

            var promise,
                params = {
                    orderId: order.id
                };

            if (order.status === ORDER_STATUS.SHIPPED) {
                promise = shipmentService.search(params);
            } else {
                promise = shipmentDraftService.search(params);
            }

            return promise
            .then(function(result) {
                if (result.content.length) {
                    return result.content[0];
                }
                return buildShipmentFromOrderAndSummaries(order, stockCardSummaries);
            });
        }

        function buildShipmentFromOrderAndSummaries(order, stockCardSummaries) {
            var shipmentLineItems = [],
                orderMatchingSummaries = filterByOrder(stockCardSummaries, order);

            orderMatchingSummaries.forEach(function(stockCardSummary) {
                shipmentLineItems.push({
                    orderable: stockCardSummary.orderable,
                    lot: stockCardSummary.lot,
                    quantityShipped: 0
                });
            });

            return shipmentDraftService.save({order: order, lineItems: shipmentLineItems});
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
