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
     * @name order.requestingFacilityFactory
     *
     * @description
     * Manages requesting facilities and serves as an abstraction layer between requestingFacilityService and controllers.
     */
    angular
        .module('order')
        .factory('requestingFacilityFactory', factory);

    factory.$inject = ['$q', 'facilityService'];

    function factory($q, facilityService) {
        var factory = {
            loadRequestingFacilities: loadRequestingFacilities
        };
        return factory;

        /**
         * @ngdoc method
         * @methodOf order.requestingFacilityFactory
         * @name loadRequestingFacilities
         *
         * @description
         * Gets the UUIDs and names of the available requesting facilities from the cache.
         *
         * @param  {String} supplyingFacilityId (optional) the ID of the given supplying facility
         * @return {Promise}                    the promise resolving to requesting facilities for the given supplying facility
         */
        function loadRequestingFacilities(supplyingFacilityId) {
            var requestingFacilities = [],
                deferred = $q.defer();

            $q.all([
                facilityService.getRequestingFacilities(supplyingFacilityId),
                facilityService.getAllMinimal()
            ]).then(function(facilities) {
                facilities[0].forEach(function(facility) {
                    facilities[1].forEach(function(minimalFacility) {
                        if (facility == minimalFacility.id) {
                            requestingFacilities.push(minimalFacility);
                        }
                    });
                });
                deferred.resolve(requestingFacilities);
            }).catch(function(){
                deferred.reject();
            });

            return deferred.promise;
        }
    }

})();
