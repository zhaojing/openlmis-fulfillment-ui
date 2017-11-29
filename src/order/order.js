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
         * @param  {String}  id                                     the UUID of the order
         * @param  {String}  emergency                              indicates if order is emergency
         * @param  {String}  createdDate                            the created date of the order
         * @param  {String}  program                                the program of the order
         * @param  {String}  requestingFacility                     the requesting facility of the order
         * @param  {String}  orderCode                              the code of the order
         * @param  {String}  status                                 the status of the order
         * @param  {String}  orderLineItems                         the order line items of the order
         * @param  {String}  processingPeriod                       the processing period of the order
         * @param  {String}  lastUpdatedDate                        the date of the last order update
         * @param  {String}  facility                               the date of the last order update
         * @param  {String}  receivingFacility                      the date of the last order update
         * @return {Order}                                          the order object
         */
        function Order(id, emergency, createdDate, program, requestingFacility, orderCode, status,
                       orderLineItems, processingPeriod, lastUpdatedDate, facility,
                       receivingFacility) {
            this.id = id;
            this.emergency = emergency;
            this.createdDate = createdDate;
            this.program = program;
            this.requestingFacility = requestingFacility;
            this.orderCode = orderCode;
            this.status = status;
            this.orderLineItems = orderLineItems;
            this.processingPeriod = processingPeriod;
            this.lastUpdatedDate = lastUpdatedDate;
            this.facility = facility;
            this.receivingFacility = receivingFacility;
        }

    }

})();
