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
     * @name order.orderLineItemFactory
     *
     * @description
     * Singleton of the OrderLineItemFactory class.
     */
    angular
        .module('order')
        .factory('orderLineItemFactory', orderLineItemFactory);

    orderLineItemFactory.$inject = ['OrderLineItemFactory'];

    function orderLineItemFactory(OrderLineItemFactory) {
        return new OrderLineItemFactory();
    }

    /**
     * @ngdoc service
     * @name order.OrderLineItemFactory
     *
     * @description
     * Responsible for creating object of the OrderLineItem class. This is the only place that
     * should ever create or restore objects of this class.
     * @type {Array}
     */
    angular
        .module('order')
        .factory('OrderLineItemFactory', OrderLineItemFactory);

    OrderLineItemFactory.$inject = ['OrderLineItem', 'AbstractFactory', 'classExtender'];

    function OrderLineItemFactory(OrderLineItem, AbstractFactory, classExtender) {

        classExtender.extend(OrderLineItemFactory, AbstractFactory);

        OrderLineItemFactory.prototype.buildFromResponse = buildFromResponse;

        return OrderLineItemFactory;

        function OrderLineItemFactory() {}

        /**
         * @ngdoc method
         * @methodOf order.OrderLineItemFactory
         * @name buildFromResponse
         *
         * @description
         * Builds an instance of the OrderLineItem class based on the provided server response.
         */
        function buildFromResponse(response) {
            if (!response) {
                return undefined;
            }

            return new OrderLineItem(
                response.id,
                response.filledQuantity,
                response.orderable, // TODO: We should be calling orderableFactory here
                response.orderedQuantity,
                response.packsToShip
            );
        }

    }

})();
