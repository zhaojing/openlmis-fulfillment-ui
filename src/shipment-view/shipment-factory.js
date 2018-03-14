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
     * @name shipment-view.ShipmentFactory
     *
     * @description
     * Service for getting shipment (draft or finalized) based on order.
     */
    angular
        .module('shipment-view')
        .factory('ShipmentFactory', ShipmentFactory);

    ShipmentFactory.$inject = ['StockCardSummaryRepositoryImpl'];

    function ShipmentFactory(StockCardSummaryRepositoryImpl) {

        ShipmentFactory.prototype.buildFromOrder = buildFromOrder;

        return ShipmentFactory;

        function ShipmentFactory() {}

        /**
         * @ngdoc method
         * @methodOf shipment-view.ShipmentFactory
         * @name buildFromOrder
         *
         * @description
         * Retrieves a shipment (draft or finalized) based on order status.
         *
         * @param  {Object}  order              order that we want to get shipment for
         * @param  {Array}   stockCardSummaries stock card summaries for order supplying facility
         * @return {Promise}                    the promise resolving to a shipment
         */
        function buildFromOrder(order) {
            var orderableIds = order.orderLineItems.map(function(lineItem) {
                return lineItem.orderable.id;
            });

            return new StockCardSummaryRepositoryImpl().query({
                programId: order.program.id,
                facilityId: order.supplyingFacility.id,
                orderableId: orderableIds
            })
            .then(function(page) {
                return page.content;
            })
            .then(function(summaries) {
                var shipmentLineItems = [];

                summaries.forEach(function(summary) {
                    summary.canFulfillForMe.forEach(function(canFulfillForMe) {
                        shipmentLineItems.push({
                            orderable: canFulfillForMe.orderable,
                            lot: canFulfillForMe.lot,
                            quantityShipped: 0
                        });
                    });
                });

                return {
                    order: order,
                    lineItems: shipmentLineItems
                };
            });
        }
    }

})();