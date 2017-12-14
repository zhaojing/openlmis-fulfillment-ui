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
     * @name order.basicOrderFactory
     *
     * @description
     * Singleton of the BasicOrderFactory class.
     */
    angular
        .module('order')
        .factory('basicOrderFactory', basicOrderFactory);

    basicOrderFactory.$inject = [
        'BasicOrderFactory'
    ];

    function basicOrderFactory(BasicOrderFactory) {
        return new BasicOrderFactory();
    }

    /**
     * @ngdoc service
     * @name order.BasicOrderFactory
     *
     * @description
     * Responsible for creating objects of the BasicOrder class. This is the only place that
     * should ever create or restore objects of this class.
     */
    angular
        .module('order')
        .factory('BasicOrderFactory', BasicOrderFactory);

    BasicOrderFactory.$inject = [
        'dateUtils', 'BasicOrder', 'classExtender', 'AbstractFactory'
    ];

    function BasicOrderFactory(dateUtils, BasicOrder, classExtender, AbstractFactory) {

        classExtender.extend(BasicOrderFactory, AbstractFactory);
        BasicOrderFactory.prototype.buildFromResponse = buildFromResponse;

        return BasicOrderFactory;

        function BasicOrderFactory() {
        }

        /**
         * @ngdoc method
         * @methodOf order.BasicOrderFactory
         * @name buildFromResponse
         *
         * @description
         * Builds an instance of the BasicOrder class based on the provided server response.
         *
         * @param   {Object}        response    the server response representing an order
         * @return  {BasicOrder}                the instance of BasicOrder class built based on the
         *                                      server response
         */
        function buildFromResponse (response) {
            if (!response) {
                return response;
            }

            verifyResponse(response);

            return new BasicOrder(
                response.id, response.emergency, dateUtils.toDate(response.createdDate),
                response.program, response.requestingFacility, response.orderCode, response.status,
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
