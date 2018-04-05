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
     * @name referencedata-orderable-fulfills.OrderableFulfillsResource
     *
     * @description
     * Communicates with the Orderable Fulfills REST API of the OpenLMIS server.
     */
    angular
        .module('referencedata-orderable-fulfills')
        .factory('OrderableFulfillsResource', OrderableFulfillsResource);

    OrderableFulfillsResource.$inject = ['referencedataUrlFactory', 'OpenlmisResource', 'classExtender', '$q'];

    function OrderableFulfillsResource(referencedataUrlFactory, OpenlmisResource, classExtender, $q) {

        classExtender.extend(OrderableFulfillsResource, OpenlmisResource);

        OrderableFulfillsResource.prototype.query = query;

        return OrderableFulfillsResource;

        function OrderableFulfillsResource() {
            this.super('/api/orderableFulfills');
        }

        function query(params) {
            var requests = [];
            var resource = this.resource;
            this.splitter.split(this.uri, params).forEach(function(params) {
                requests.push(resource.query(params).$promise);
            });

            return $q.all(requests)
            .then(function(responses) {
                return responses.reduce(function(left, right) {
                    Object.keys(right).forEach(function(key) {
                        left[key] = right[key];
                    });
                    return left;
                });
            });
        }
    }
})();
