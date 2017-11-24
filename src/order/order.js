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
     * @name order.Order
     *
     * @description
     * Represents a single order.
     */
    angular
        .module('order')
        .factory('Order', Order);

    function Order() {

        return Order;

        /**
         * @ngdoc method
         * @methodOf order.Order
         * @name Order
         *
         * @description
         * Creates a new instance of the Order class.
         *
         * @param  {String}  id                                     the UUID of the order to be created
         * @param  {String}  emergency                              indicate of order is emergency
         * @param  {String}  createdDate                            the createdDate of the order to be created
         * @param  {String}  program                                the program of the order to be created
         * @param  {String}  requestingFacility                     the requestingFacility of the order to be created
         * @param  {String}  orderCode                              the code of the order to be created
         * @param  {String}  status                                 the status of the order to be created
         * @param  {String}  orderLineItems                         the orderLineItems of the order to be created
         * @return {Object}                                         the order object
         */
        function Order(id, emergency, createdDate, program, requestingFacility, orderCode, status,
                       orderLineItems) {
            this.id = id;
            this.emergency = emergency;
            this.createdDate = createdDate;
            this.program = program;
            this.requestingFacility = requestingFacility;
            this.orderCode = orderCode;
            this.status = status;
            this.orderLineItems = orderLineItems;
        }

    }

})();
