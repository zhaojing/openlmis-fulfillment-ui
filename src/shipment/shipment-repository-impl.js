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
     * @name shipment.ShipmentRepositoryImpl
     *
     * @description
     * Communicates with the shipments endpoint of the OpenLMIS.
     */
    angular
        .module('shipment')
        .factory('ShipmentRepositoryImpl', ShipmentRepositoryImpl);

    ShipmentRepositoryImpl.$inject = ['$resource', 'fulfillmentUrlFactory', '$q'];

    function ShipmentRepositoryImpl($resource, fulfillmentUrlFactory, $q) {

        ShipmentRepositoryImpl.prototype.get = get;

        return ShipmentRepositoryImpl;

        /**
         * @ngdoc method
         * @methodOf shipment.ShipmentRepositoryImpl
         * @name ShipmentRepositoryImpl
         *
         * @description
         * Creates an instance of the ShipmentRepositoryImpl class.
         */
        function ShipmentRepositoryImpl() {
            this.resource = $resource(fulfillmentUrlFactory('/api/shipments/:id'))
        }

        /**
         * @ngdoc method
         * @methodOf shipment.ShipmentRepositoryImpl
         * @name get
         *
         * @description
         * Retrieves a shipment with the given ID.
         *
         * @param   {string}    id  the ID of the shipment
         * @return  {Promise}       the promise resolving to server response, rejects if ID is not
         *                          given or if the request fails
         */
        function get(id) {
            if (id) {
                return this.resource.get({
                    id: id
                }).$promise;
            }
            return $q.reject();
        }

    }

})();
