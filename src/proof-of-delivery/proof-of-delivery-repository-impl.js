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
     * @name proof-of-delivery.ProofOfDeliveryRepositoryImpl
     *
     * @description
     * Implementation of the ProofOfDeliveryRepository interface. Communicates with the REST API of
     * the OpenLMIS server.
     */
    angular
        .module('proof-of-delivery')
        .factory('ProofOfDeliveryRepositoryImpl', ProofOfDeliveryRepositoryImpl);

    ProofOfDeliveryRepositoryImpl.$inject = [
        '$resource', 'fulfillmentUrlFactory', 'ShipmentRepositoryImpl'
    ];

    function ProofOfDeliveryRepositoryImpl($resource, fulfillmentUrlFactory,
                                           ShipmentRepositoryImpl) {

        ProofOfDeliveryRepositoryImpl.prototype.get = get;
        ProofOfDeliveryRepositoryImpl.prototype.update = update;

        return ProofOfDeliveryRepositoryImpl;

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery.ProofOfDeliveryRepositoryImpl
         * @name ProofOfDeliveryRepositoryImpl
         * @constructor
         *
         * @description
         * Creates an instance of the ProofOfDeliveryRepositoryImpl class.
         */
        function ProofOfDeliveryRepositoryImpl() {
            this.shipmentRepositoryImpl = new ShipmentRepositoryImpl();
            this.resource = $resource(fulfillmentUrlFactory('/api/proofOfDeliveries/:id'), {}, {
                update: {
                    method: 'PUT'
                }
            });
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery.ProofOfDeliveryRepositoryImpl
         * @name get
         *
         * @description
         * Retrieves a proof of delivery from the OpenLMIS server. Communicates with the GET
         * endpoint of the Proof of Delivery REST API.
         *
         * @param   {string}    id  the ID of the Proof of Delivery to retrieve
         * @return  {Promise}       the promise resolving to server response
         */
        function get(id) {
            var shipmentRepositoryImpl = this.shipmentRepositoryImpl;
            return this.resource.get({
                id: id
            }).$promise
            .then(function(proofOfDeliveryJson) {
                return shipmentRepositoryImpl.get(proofOfDeliveryJson.shipment.id)
                .then(function(shipmentJson) {
                    proofOfDeliveryJson.lineItems.forEach(function(lineItem) {
                        lineItem.quantityShipped = getQuantityShipped(
                            lineItem, shipmentJson.lineItems
                        );
                    })
                    return proofOfDeliveryJson;
                });
            });
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery.ProofOfDeliveryRepositoryImpl
         * @name update
         *
         * @description
         * Updates the given Proof of Delivery on the OpenLMIS server. Communicates with the PUT
         * endpoint of the Proof of Delivery REST API.
         *
         * @param   {string}    proofOfDelivery the Proof of Delivery to updated
         * @return  {Promise}                   the promise resolving to server response
         */
        function update(proofOfDelivery) {
            return this.resource.update(
                {
                    id: proofOfDelivery.id
                },
                proofOfDelivery
            ).$promise;
        }

        function getQuantityShipped(lineItem, shipmentLineItems) {
            return shipmentLineItems.filter(function(shipmentLineItem) {
                return shipmentLineItem.orderable.id === lineItem.orderable.id &&
                    areLotsEqual(shipmentLineItem.lot, lineItem.lot);
            })[0].quantityShipped;
        }

        function areLotsEqual(left, right) {
            if (left && right && left.id === right.id) {
                return true;
            } else if (!left && !right)  {
                return true;
            }
            return false;
        }

    }

})();
