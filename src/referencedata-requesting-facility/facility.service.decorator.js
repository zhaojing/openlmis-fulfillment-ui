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
     * @name referencedata-requesting-facility.facilityService
     *
     * @description
     * Decorates methods to the facilityService, making it so the minimal
     * facility list is loaded once.
     */
    angular.module('referencedata-requesting-facility')
        .config(config);

    config.$inject = ['$provide'];

    function config($provide) {
        $provide.decorator('facilityService', decorator);
    }

    decorator.$inject = ['$delegate', '$resource', 'fulfillmentUrlFactory'];
    function decorator($delegate, $resource, fulfillmentUrlFactory) {

        $delegate.getRequestingFacilities = getRequestingFacilities;
        $delegate.delegatedResource = $resource(fulfillmentUrlFactory('/api/orders'), {}, {
            getRequestingFacilities: {
                method: 'GET',
                url: fulfillmentUrlFactory('/api/orders/requestingFacilities'),
                isArray: true
            }
        });

        return $delegate;

        /**
         * @ngdoc method
         * @methodOf referencedata-requesting-facility.facilityService
         * @name getRequestingFacilities
         *
         * @description
         * Retrieves the distinct UUIDs of the available requesting facilities.
         *
         * @param  {String} supplyingFacilityId the ID of the given supplying facility
         * @return {Promise}       the list of all requesting facilities for the given supplying facility
         */
        function getRequestingFacilities(supplyingFacilityId) {
            return $delegate.delegatedResource.getRequestingFacilities({
                supplyingFacility: supplyingFacilityId
            }).$promise;
        }
    }

})();
