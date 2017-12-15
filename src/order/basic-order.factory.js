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
     * Responsible for creating and restoring basic orders. This is the only
     */
    angular
        .module('order')
        .factory('basicOrderFactory', basicOrderFactory);

    basicOrderFactory.$inject = ['AbstractFactory', 'dateUtils'];

    function basicOrderFactory(AbstractFactory, dateUtils) {
        return new AbstractFactory(buildFromResponse);

        /**
         * @ngdoc method
         * @methodOf order.basicOrderFactory
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
            var createdDate = dateUtils.toDate(response.createdDate),
                lastUpdatedDate = dateUtils.toDate(response.lastUpdatedDate),

                processingPeriod = buildProcessingPeriodFromResponse(response.processingPeriod);

            return {
                id: response.id,
                emergency: response.emergency,
                createdDate: createdDate,
                program: response.program,
                requestingFacility: response.requestingFacility,
                orderCode: response.orderCode,
                status: response.status,
                processingPeriod: processingPeriod,
                lastUpdatedDate: lastUpdatedDate,
                facility: response.facility,
                receivingFacility: response.receivingFacility,
                supplyingFacility: response.supplyingFacility,
                lastUpdater: response.lastUpdater
            };
        }

        // TODO: This should be part of the ProcessingPeriodFactory class
        function buildProcessingPeriodFromResponse(response) {
            var processingPeriod = angular.copy(response);
            processingPeriod.startDate = dateUtils.toDate(processingPeriod.startDate);
            processingPeriod.endDate = dateUtils.toDate(processingPeriod.endDate);
            return processingPeriod;
        }
    }

})();
