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
     * @name proof-of-delivery.proofOfDeliveryService
     *
     * @description
     * Responsible for retrieving proofs of delivery from the server.
     */
	angular
		.module('proof-of-delivery')
	    .service('proofOfDeliveryService', service);

    service.$inject = ['$filter', '$resource', 'fulfillmentUrlFactory', 'dateUtils'];

    function service($filter, $resource, fulfillmentUrlFactory, dateUtils) {

        var resource = $resource(fulfillmentUrlFactory('/api/proofOfDeliveries/:id'), {}, {
			get: {
				method: 'GET',
				transformResponse: transformResponse
			},
			save: {
				method: 'PUT',
				transformRequest: transformRequest
			},
			submit: {
				method: 'POST',
				url: fulfillmentUrlFactory('/api/proofOfDeliveries/:id/submit')
			},
            getByOrderId: {
                method: 'GET',
                transformResponse: transformPOD,
                url: fulfillmentUrlFactory('/api/orders/:orderId/proofOfDeliveries')
            }
		});

        return {
            get: get,
			getByOrderId: getByOrderId,
			save: save,
			submit: submit
        };

		/**
         * @ngdoc method
         * @methodOf proof-of-delivery.proofOfDeliveryService
         * @name get
         *
         * @description
         * Retrieves proof of delivery by id.
         *
         * @param  {String}  podId POD UUID
         * @return {Promise}       POD
         */
        function get(podId) {
            return resource.get({
				id: podId
			}).$promise;
        }

		/**
         * @ngdoc method
         * @methodOf proof-of-delivery.proofOfDeliveryService
         * @name save
         *
         * @description
         * Saves proof of delivery.
         *
         * @param  {Object}  pod POD
         * @return {Promise}     POD
         */
        function save(pod) {
            return resource.save({
				id: pod.id
			}, pod).$promise;
        }

		/**
         * @ngdoc method
         * @methodOf proof-of-delivery.proofOfDeliveryService
         * @name submit
         *
         * @description
         * Submits proof of delivery.
         *
         * @param  {String}  podId POD UUID
         * @return {Promise}       POD
         */
        function submit(podId) {
            return resource.submit({
				id: podId
			}, {}).$promise;
        }

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
            return resource.getByOrderId({
                orderId: orderId
            }).$promise;
        }

		function transformResponse(data, headers, status) {
			var pod = data;

            if (status === 200) {
                pod = angular.fromJson(data);

				if(pod.receivedDate) pod.receivedDate = dateUtils.toDate(pod.receivedDate);
				if(pod.order.createdDate) pod.order.createdDate = dateUtils.toDate(pod.order.createdDate);
            }

            return pod;
        }

		function transformRequest(pod) {
			if (pod.receivedDate) pod.receivedDate = $filter('isoDate')(pod.receivedDate);
			if (pod.order.createdDate) pod.order.createdDate = pod.order.createdDate.toISOString();

            return angular.toJson(pod);
        }

        function transformPOD(data, headers, status) {
            if (status === 200) {
                var pod = angular.fromJson(data);

                if(pod.receivedDate) {
                    pod.receivedDate = dateUtils.toDate(pod.receivedDate);
                }

                if(pod.order.createdDate) {
                    pod.order.createdDate = dateUtils.toDate(pod.order.createdDate);
                }

                if(pod.order.lastUpdatedDate) {
                    pod.order.lastUpdatedDate = dateUtils.toDate(pod.order.lastUpdatedDate);
                }

                return pod;
            }

            return data;
        }
    }
})();
