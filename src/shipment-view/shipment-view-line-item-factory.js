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
        'StockCardResource', 'VVM_STATUS', 'ShipmentViewLineItem', 'ShipmentViewLineItemGroup'
    ];

    function ShipmentViewLineItemFactory(StockCardResource, VVM_STATUS,
                                         ShipmentViewLineItem, ShipmentViewLineItemGroup) {

        ShipmentViewLineItemFactory.prototype.createFrom = buildFrom;

        return ShipmentViewLineItemFactory;

        function ShipmentViewLineItemFactory() {}

        function buildFrom(shipment, summaries) {
            var shipmentLineItemMap = mapByOrderableAndLot(shipment.lineItems);

            return shipment.order.orderLineItems
            .map(function(orderLineItem) {
                var summary = summaries.filter(function(summary) {
                    return summary.orderable.id === orderLineItem.orderable.id;
                })[0];

                if (!summary) {
                    return new ShipmentViewLineItemGroup({
                        productCode: orderLineItem.orderable.productCode,
                        productName: orderLineItem.orderable.fullProductName,
                        lineItems: [],
                        orderQuantity: orderLineItem.orderedQuantity,
                        isMainGroup: true,
                        netContent: orderLineItem.orderable.netContent
                    });
                }

                if (isForGenericOrderable(summary) && shipmentLineItemMap[summary.orderable.id]) {
                    return new ShipmentViewLineItem({
                        productCode: summary.orderable.productCode,
                        productName: summary.orderable.fullProductName,
                        shipmentLineItem: shipmentLineItemMap[summary.orderable.id][undefined],
                        orderQuantity: getOrderQuantity(shipment.order.orderLineItems, summary.orderable.id),
                        netContent: orderLineItem.orderable.netContent
                    });
                }
                var uniqueOrderables = getUniqueOrderables(summary.canFulfillForMe),
                    canFulfillForMeMap = groupByOrderables(summary.canFulfillForMe),
                    tradeItemLineItems = [];

                uniqueOrderables.forEach(function(orderable) {
                    var lotLineItems = [];
                    canFulfillForMeMap[orderable.id].forEach(function(canFulfillForMe) {
                        var lotId = canFulfillForMe.lot ? canFulfillForMe.lot.id : undefined;



                        if (shipmentLineItemMap[canFulfillForMe.orderable.id] && shipmentLineItemMap[canFulfillForMe.orderable.id][lotId]) {
                            lotLineItems.push(new ShipmentViewLineItem({
                                lot: canFulfillForMe.lot,
                                vvmStatus: getVvmStatus(canFulfillForMe),
                                shipmentLineItem: shipmentLineItemMap[canFulfillForMe.orderable.id][lotId],
                                netContent: orderable.netContent
                            }));
                        }
                        
                    });

                    lotLineItems.sort(compareLineItems);

                    if (lotLineItems.length > 1) {
                        tradeItemLineItems.push(new ShipmentViewLineItemGroup({
                            productCode: orderable.productCode,
                            productName: orderable.fullProductName,
                            lineItems: lotLineItems,
                            netContent: orderable.netContent
                        }));
                    } else if (lotLineItems.length) {
                        tradeItemLineItems.push(new ShipmentViewLineItem({
                            productCode: orderable.productCode,
                            productName: orderable.fullProductName,
                            lot: lotLineItems[0].lot,
                            vvmStatus: lotLineItems[0].vvmStatus,
                            shipmentLineItem: lotLineItems[0].shipmentLineItem,
                            netContent: orderable.netContent
                        }));
                    }
                });

                return new ShipmentViewLineItemGroup({
                    productCode: summary.orderable.productCode,
                    productName: summary.orderable.fullProductName,
                    lineItems: tradeItemLineItems,
                    orderQuantity: shipment.order.orderLineItems.filter(function(lineItem) {
                        return lineItem.orderable.id === summary.orderable.id;
                    })[0].orderedQuantity,
                    isMainGroup: true,
                    netContent: summary.orderable.netContent
                });
            })
            .reduce(function(shipmentViewLineItems, lineItem) {
                shipmentViewLineItems.push(lineItem);
                if (lineItem.lineItems && !lineItem.noStockAvailable) {
                    lineItem.lineItems.forEach(function(lineItem) {
                        shipmentViewLineItems.push(lineItem);
                        if (lineItem.lineItems) {
                            lineItem.lineItems.forEach(function(lineItem) {
                                shipmentViewLineItems.push(lineItem);
                            });
                        }
                    });
                }
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

        function mapByOrderableAndLot(lineItems) {
            return lineItems.reduce(function(map, lineItem) {
                var orderableId = lineItem.orderable.id,
                    lotId = lineItem.lot ? lineItem.lot.id : undefined;

                if (!map[orderableId]) {
                    map[orderableId] = {};
                }

                map[orderableId][lotId] = lineItem;

                return map;
            }, {});
        }

        function getUniqueOrderables(canFulfillForMe) {
            var orderablesMap = canFulfillForMe.reduce(function(orderables, canFulfillForMe) {
                orderables[canFulfillForMe.orderable.id] = canFulfillForMe.orderable;
                return orderables;
            }, {});

            return Object.keys(orderablesMap).map(function(id) {
                return orderablesMap[id]
            });
        }

        function getOrderQuantity(lineItems, orderableId) {
            return lineItems.filter(function(lineItem) {
                return lineItem.orderable.id === orderableId;
            })[0].orderedQuantity;
        }

        function isForGenericOrderable(summary) {
            return summary.canFulfillForMe.length === 1 &&
                summary.orderable.id === summary.canFulfillForMe[0].orderable.id;
        }

        function compareLineItems(left, right) {
            return compareLots(left.lot, right.lot) ||
                compareVvmStatuses(left.vvmStatus, right.vvmStatus) ||
                compareExpirationDate(getExpirationDate(left), getExpirationDate(right)) ||
                compare(left.shipmentLineItem.stockOnHand, right.shipmentLineItem.stockOnHand);
            }

        function compareVvmStatuses(left, right) {
            if (left === right || !left || !right) {
                return 0;
            }

            if (!left && right) {
                return -1;
            }

            if (left && !right) {
                return 1;
            }

            return left > right ? -1 : 1;
        }

        function compareExpirationDate(left, right) {
            return !left && right ? 1 : !right ? -1 : compare(left, right);
        }

        function compare(left, right) {
            return left === right ? 0 : (left && right ? (left > right ? 1 : -1) : (left ? 1 : -1));
        }

        function compareLots(left, right) {
            if ((!left && !right) || (left && right)) {
                return 0;
            }

            return !left ? -1 : 1;
        }

        function getVvmStatus(canFulfillForMe) {
            if (canFulfillForMe.stockCard.extraData) {
                return canFulfillForMe.stockCard.extraData.vvmStatus;
            }
        }

        function getExpirationDate(lineItem) {
            if (lineItem.lot && lineItem.lot.expirationDate) {
                return new Date(lineItem.lot.expirationDate).getTime();
            }
        }
    }
})();