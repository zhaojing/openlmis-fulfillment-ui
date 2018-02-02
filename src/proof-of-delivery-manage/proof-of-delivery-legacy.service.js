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
     * @name proof-of-delivery.proofOfDeliveryLegacyService
     *
     * @description
     * Responsible for retrieving proofs of delivery from the server.
     */
	angular
		.module('proof-of-delivery')
	    .service('proofOfDeliveryLegacyService', service);

    service.$inject = ['$resource', 'fulfillmentUrlFactory'];

    function service($resource, fulfillmentUrlFactory) {

        var resource = $resource(fulfillmentUrlFactory('/api/orders/:orderId/proofOfDeliveries'));

        return {
			getByOrderId: getByOrderId
        };

        /**
         * @ngdoc method
         * @methodOf order.orderService
         * @name getByOrderId
         *
         * @description
         * Retrieves a list of Proof of Deliveries for the given Order.
         *
         * @param  {String} orderId the ID of the given order
         * @return {Promise}        the list of all PODs for the given order
         */
        function getByOrderId(orderId) {
            return resource.get({
                orderId: orderId
            }).$promise;
        }
    }
})();
