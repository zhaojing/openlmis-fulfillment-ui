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
     * Responsible for creating objects of the Order class. This is the only place that
     * should ever create or restore objects of this class.
     */
    angular
        .module('order')
        .factory('orderFactory', orderFactory);

    orderFactory.$inject = ['dateUtils', 'basicOrderFactory', 'AbstractFactory'];

    function orderFactory(dateUtils, basicOrderFactory, AbstractFactory) {
        return new AbstractFactory(buildFromResponse);

        /**
         * @ngdoc method
         * @methodOf order.orderFactory
         * @name buildFromResponse
         *
         * @description
         * Builds an instance of the Order class based on the provided server response.
         *
         * @param   {Object}    response    the server response representing an order
         * @return  {Order}                 the instance of Order class built based on the server
         *                                  response
         */
        function buildFromResponse(response) {
            var order = basicOrderFactory.buildFromResponse(response);

            order.orderLineItems = response.orderLineItems;

            return order;
        }
    }

})();
