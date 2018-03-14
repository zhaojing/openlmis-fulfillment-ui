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
     * @name shipment.ShipmentRepositoryImpl
     *
     * @description
     * Implementation of the ShipmentRepository interface. Communicates with the REST API of the OpenLMIS server.
     */
    angular
        .module('shipment')
        .factory('ShipmentRepositoryImpl', ShipmentRepositoryImpl);

    ShipmentRepositoryImpl.$inject = [
        'ShipmentResource', 'ShipmentDraftResource', 'OrderResource', 'StockCardSummaryRepositoryImpl'
    ];

    function ShipmentRepositoryImpl(ShipmentResource, ShipmentDraftResource, OrderResource,
                                    StockCardSummaryRepositoryImpl) {

        ShipmentRepositoryImpl.prototype.create = create;
        ShipmentRepositoryImpl.prototype.createDraft = createDraft;
        ShipmentRepositoryImpl.prototype.updateDraft = updateDraft;
        ShipmentRepositoryImpl.prototype.getByOrderId = getByOrderId;
        ShipmentRepositoryImpl.prototype.getDraftByOrderId = getDraftByOrderId;

        return ShipmentRepositoryImpl;

        function ShipmentRepositoryImpl() {
            this.shipmentResource = new ShipmentResource();
            this.shipmentDraftResource = new ShipmentDraftResource();
            this.stockCardSummaryRepositoryImpl = new StockCardSummaryRepositoryImpl();
            this.orderResource = new OrderResource();
        }

        function create(json) {
            var orderResource = this.orderResource,
                stockCardSummaryRepositoryImpl = this.stockCardSummaryRepositoryImpl;

            return this.shipmentResource.create(json)
            .then(function(shipmentJson) {
                return extendResponse(shipmentJson, orderResource, stockCardSummaryRepositoryImpl);
            });
        }

        function createDraft(json) {
            var orderResource = this.orderResource,
                stockCardSummaryRepositoryImpl = this.stockCardSummaryRepositoryImpl;

            return this.shipmentDraftResource.create(json)
            .then(function(shipmentJson) {
                return extendResponse(shipmentJson, orderResource, stockCardSummaryRepositoryImpl);
             });
        }

        function updateDraft(draft) {
            return this.shipmentDraftResource.update(draft);
        }

        function getByOrderId(orderId) {
            var orderResource = this.orderResource,
                stockCardSummaryRepositoryImpl = this.stockCardSummaryRepositoryImpl;

            return this.shipmentResource.query({
                orderId: orderId
            })
            .then(function(page) {
                return extendResponse(page.content[0], orderResource, stockCardSummaryRepositoryImpl);
            });
        }

        function getDraftByOrderId(orderId) {
            var orderResource = this.orderResource,
                stockCardSummaryRepositoryImpl = this.stockCardSummaryRepositoryImpl;

            return this.shipmentDraftResource.query({
                orderId: orderId
            })
            .then(function(page) {
                return extendResponse(page.content[0], orderResource, stockCardSummaryRepositoryImpl);
            });
        }

        function extendResponse(shipmentJson, orderResource, stockCardSummaryRepositoryImpl) {
            return orderResource.get(shipmentJson.order.id)
            .then(function(orderJson) {
                var orderableIds = orderJson.orderLineItems.map(function(lineItem) {
                    return lineItem.orderable.id;
                });

                return stockCardSummaryRepositoryImpl.query({
                    programId: orderJson.program.id,
                    facilityId: orderJson.supplyingFacility.id,
                    orderableId: orderableIds
                })
                .then(function(page) {
                    return page.content;
                })
                .then(mapCanFulfillForMe)
                .then(function(canFulfillForMeMap) {
                    return combineResponses(shipmentJson, orderJson, canFulfillForMeMap);
                });
            });
        }

        function combineResponses(shipment, order, canFulfillForMeMap) {
            shipment.order = order;

            shipment.lineItems.forEach(function(lineItem) {
                lineItem.canFulfillForMe = canFulfillForMeMap[lineItem.orderable.id][getLotId(lineItem.lot)];
            });

            return shipment;
        }

        function mapCanFulfillForMe(summaries) {
            var canFulfillForMeMap = {};

            summaries.forEach(function(summary) {
                summary.canFulfillForMe.forEach(function(canFulfillForMe) {
                    var orderableId = canFulfillForMe.orderable.id,
                        lotId = canFulfillForMe.lot ? canFulfillForMe.lot.id : undefined;

                    if (!canFulfillForMeMap[orderableId]) {
                        canFulfillForMeMap[orderableId] = {};
                    }

                    canFulfillForMeMap[orderableId][lotId] = canFulfillForMe;
                });
            });

            return canFulfillForMeMap;
        }

        function getLotId(lot) {
            return lot ? lot.id : undefined;
        }
    }
})();
