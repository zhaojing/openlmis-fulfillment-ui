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
     * Application layer service that prepares domain objects to be used on the view.
     */
    angular
        .module('proof-of-delivery-view')
        .service('proofOfDeliveryService', proofOfDeliveryService);

    proofOfDeliveryService.$inject = [
        '$q', 'ProofOfDeliveryRepository', 'ProofOfDeliveryRepositoryImpl', 'ShipmentRepositoryImpl', 'notificationService',
        'loadingModalService'
    ];

    function proofOfDeliveryService($q, ProofOfDeliveryRepository, ProofOfDeliveryRepositoryImpl,
                                    ShipmentRepositoryImpl, notificationService, loadingModalService) {
        var proofOfDeliveryService = this,
            repository = new ProofOfDeliveryRepository(
                new ProofOfDeliveryRepositoryImpl()
            );

        proofOfDeliveryService.get = get;

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery.proofOfDeliveryService
         * @name get
         *
         * @description
         * Returns a domain object representing a Proof of Delivery decorated with utility methods.
         *
         * @param  {string}     id  the ID of the Proof of Delivery
         * @return {Promise}        the promise resolving to decorated Proof of Delivery
         */
        function get(id) {
            if (id) {
                return repository.get(id)
                .then(decorate);
            }
            return $q.reject();
        }

        function decorate(proofOfDelivery) {
            var save = proofOfDelivery.save;

            proofOfDelivery.save = function() {
                loadingModalService.open();
                return save.apply(this, arguments)
                .then(function() {
                    notificationService.success('proofOfDeliveryView.proofOfDeliveryHasBeenSaved');
                })
                .catch(function() {
                    notificationService.error('proofOfDeliveryView.failedToSaveProofOfDelivery');
                    return $q.reject();
                })
                .finally(loadingModalService.close);
            };

            return proofOfDelivery;
        }
    }

})();
