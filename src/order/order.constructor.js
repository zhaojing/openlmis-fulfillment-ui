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
     * @name order.OrderConstructor
     *
     * @description
     * Responsible for constructing objects for Order class.
     */
    angular
        .module('order')
        .factory('OrderConstructor', OrderConstructor);

    OrderConstructor.$inject = ['Order', 'dateUtils'];

    function OrderConstructor(Order, dateUtils) {
        var factory = {
            fromJson: fromJson,
            fromJsonArray: fromJsonArray
        };

        return factory;


        /**
         * @ngdoc method
         * @methodOf order.OrderConstructor
         * @name fromJson
         *
         * @description
         * Creates Order object from raw json.
         *
         * @param {Object} jsonOrder      order represented in json
         * @return {Order}                created order
         */
        function fromJson (jsonOrder) {
            var object = angular.fromJson(jsonOrder);
            return createOrder(object);
        }

        /**
         * @ngdoc method
         * @methodOf order.OrderConstructor
         * @name fromJsonArray
         *
         * @description
         * Creates Order object list from raw json.
         *
         * @param {Object} jsonOrders      orders represented in json
         * @return {Array}                 created orders
         */
        function fromJsonArray (jsonOrders) {
            var page = angular.fromJson(jsonOrders),
                orders = [];
            page.content.forEach(function(object) {
                var order = createOrder(object);
                orders.push(order)
            });
            page.content = orders;
            return page;
        }

        function createOrder(object) {
            var processingPeriod = object.processingPeriod;
            processingPeriod.startDate = dateUtils.toDate(processingPeriod.startDate);
            processingPeriod.endDate = dateUtils.toDate(processingPeriod.endDate);

            return new Order(object.id, object.emergency, dateUtils.toDate(object.createdDate),
                object.program, object.requestingFacility, object.orderCode, object.status,
                object.orderLineItems, processingPeriod, dateUtils.toDate(object.lastUpdatedDate));
        }

    }

})();
