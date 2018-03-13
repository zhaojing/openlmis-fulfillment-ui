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
        .factory('ShipmentViewLineItemFactory', ShipmentViewLineItemFactory);

    ShipmentViewLineItemFactory.inject = [
        'TradeItemLineItem', 'CommodityTypeLineItem', 'LotLineItem'
    ];

    function ShipmentViewLineItemFactory(TradeItemLineItem, CommodityTypeLineItem, LotLineItem) {

        ShipmentViewLineItemFactory.prototype.createFrom = buildFrom;

        return ShipmentViewLineItemFactory;

        function ShipmentViewLineItemFactory() {}

        function buildFrom(shipment, summaries) {
            var shipmentLineItemMap = shipment.lineItems.reduce(function (map, lineItem) {
                var orderableId = lineItem.orderable.id,
                    lotId = lineItem.lot ? lineItem.lot.id : undefined;

                if (!map[orderableId]) {
                    map[orderableId] = {};
                }

                map[orderableId][lotId] = lineItem;

                return map;
            }, {});

            return summaries
            .map(function(summary) {
                var uniqueOrderables = getUniqueOrderables(summary.canFulfillForMe),
                    canFulfillForMeMap = groupByOrderables(summary.canFulfillForMe),
                    
                    tradeItemLineItems = uniqueOrderables.map(function(orderable) {
                        var lotLineItems = canFulfillForMeMap[orderable.id].map(function(canFulfillForMe) {
                            var lotId = canFulfillForMe.lot ? canFulfillForMe.lot.id : undefined;
                            return new LotLineItem(
                                canFulfillForMe,
                                shipmentLineItemMap[canFulfillForMe.orderable.id][lotId]
                            );
                        });

                        return new TradeItemLineItem(orderable, lotLineItems);
                    });

                return new CommodityTypeLineItem(
                    summary,
                    shipment.order.orderLineItems.filter(function(lineItem) {
                        return lineItem.orderable.id === summary.orderable.id;
                    })[0].orderedQuantity,
                    tradeItemLineItems
                );
            })
            .reduce(function(shipmentViewLineItems, lineItem) {
                shipmentViewLineItems.push(lineItem);
                lineItem.tradeItemLineItems.forEach(function(lineItem) {
                    shipmentViewLineItems.push(lineItem);
                    lineItem.lotLineItems.forEach(function(lineItem) {
                        shipmentViewLineItems.push(lineItem);
                    });
                });
                return shipmentViewLineItems;
            }, []);
        }

        function groupByOrderables(canFulfillForMe) {
            return canFulfillForMe.reduce(function(canFulfillForMeMap, canFulfillForMe) {
                var orderableId = canFulfillForMe.orderable.id;

                if (!canFulfillForMeMap[orderableId]) {
                    canFulfillForMeMap[orderableId] = [];
                }

                canFulfillForMeMap[orderableId].push(canFulfillForMe);

                return canFulfillForMeMap;
            }, {});
        }

        function getUniqueOrderables(canFulfillForMe) {
            return Object.values(canFulfillForMe.reduce(function(orderables, canFulfillForMe) {
                orderables[canFulfillForMe.orderable.id] = canFulfillForMe.orderable;
                return orderables;
            }, {}));
        }
    }
})();