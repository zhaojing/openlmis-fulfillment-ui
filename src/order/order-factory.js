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
     * @name order.orderFactory
     *
     * @description
     * Singleton of the OrderFactory class.
     */
    angular
        .module('order')
        .factory('orderFactory', orderFactory);

    orderFactory.$inject = [
        'OrderFactory', 'orderLineItemFactory'
    ];

    function orderFactory(OrderFactory, orderLineItemFactory) {
        return new OrderFactory(orderLineItemFactory);
    }

    /**
     * @ngdoc service
     * @name order.OrderFactory
     *
     * @description
     * Responsible for creating objects of the Order class. This is the only place that
     * should ever create or restore objects of this class.
     */
    angular
        .module('order')
        .factory('OrderFactory', OrderFactory);

    OrderFactory.$inject = [
        'dateUtils', 'OrderLineItemFactory', 'Order', 'classExtender', 'AbstractFactory'
    ];

    function OrderFactory(dateUtils, OrderLineItemFactory, Order, classExtender, AbstractFactory) {

        classExtender.extend(OrderFactory, AbstractFactory);
        OrderFactory.prototype.buildFromResponse = buildFromResponse;

        return OrderFactory;

        function OrderFactory(orderLineItemFactory) {
            if (!orderLineItemFactory || !(orderLineItemFactory instanceof OrderLineItemFactory)) {
                throw 'An instance of orderLineItemFactory must be provided';
            }
            this.orderLineItemFactory = orderLineItemFactory;
        }

        /**
         * @ngdoc method
         * @methodOf order.OrderFactory
         * @name buildFromResponse
         *
         * @description
         * Builds an instance of the Order class based on the provided server response.
         *
         * @param   {Object}    response    the server response representing an order
         * @return  {Order}                 the instance of Order class built based on the server
     *                                      response
         */
        function buildFromResponse (response) {
            if (!response) {
                return response;
            }

            verifyResponse(response);

            return new Order(
                response.id, response.emergency, dateUtils.toDate(response.createdDate),
                response.program, response.requestingFacility, response.orderCode, response.status,
                this.orderLineItemFactory.buildFromResponseArray(response.orderLineItems),
                buildProcessingPeriodFromResponse(response.processingPeriod),
                dateUtils.toDate(response.lastUpdatedDate), response.facility,
                response.receivingFacility, response.supplyingFacility, response.lastUpdater
            );
        }

        // TODO: This should be part of the ProcessingPeriodFactory class
        function buildProcessingPeriodFromResponse(response) {
            var processingPeriod = angular.copy(response);
            processingPeriod.startDate = dateUtils.toDate(processingPeriod.startDate);
            processingPeriod.endDate = dateUtils.toDate(processingPeriod.endDate);
            return processingPeriod;
        }

        function verifyResponse(response) {
            verifyNotUndefined(response, 'createdDate');
            verifyNotUndefined(response, 'lastUpdatedDate');

            verifyNotUndefined(response, 'processingPeriod');
            verifyProcessingPeriodResponse(response.processingPeriod);
        }

        function verifyProcessingPeriodResponse(response) {
            verifyNotUndefined(response, 'startDate');
            verifyNotUndefined(response, 'endDate');
        }

        function verifyNotUndefined(response, name) {
            if (!response[name]) {
                throw name + ' must be defined';
            }
        }
    }

})();
