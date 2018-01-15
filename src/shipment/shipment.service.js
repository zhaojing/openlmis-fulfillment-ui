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
     * @name shipment.shipmentService
     *
     * @description
     * Service for communicating with the shipment draft endpoint of the OpenLMIS server.
     */
    angular
        .module('shipment')
        .service('shipmentService', shipmentService);

    shipmentService.$inject = ['$resource', 'fulfillmentUrlFactory'];

    function shipmentService($resource, fulfillmentUrlFactory) {
        var shipmentService = this,
            resource = $resource(fulfillmentUrlFactory('/api/shipments/:id'));

        shipmentService.create = create;
        shipmentService.search = search;

        /**
         * @ngdoc method
         * @methodOf shipment.shipmentService
         * @name create
         *
         * @description
         * Saves the given Shipment on the server.
         *
         * @param  {Object}  shipment the Shipment to be saved
         * @return {Promise}          the promise resolving to saved Shipment
         */
        function create(shipment) {
            if (!shipment) {
                throw 'Shipment must be defined';
            }
            return resource.save(null, shipment).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf shipment.shipmentService
         * @name search
         *
         * @description
         * Retrieves a list of shipments matching the given parameters.
         *
         * @param   {Object}    params  the list of parameters to send to the server
         * @return  {Promise}           the promise resolving to a page of shipments
         */
        function search(params) {
            return resource.get(params).$promise;
        }


    }
})();
