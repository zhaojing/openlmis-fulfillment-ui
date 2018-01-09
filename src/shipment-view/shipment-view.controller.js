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
     * @ngdoc controller
     * @name shipment-view.controller:ShipmentViewController
     *
     * @description
     * Responsible for managing shipment.
     */
    angular
        .module('shipment-view')
        .controller('ShipmentViewController', ShipmentViewController);

    ShipmentViewController.$inject = [
        'shipment', 'shipmentService', 'loadingModalService', '$state', 'confirmService',
        'notificationService', 'stateTrackerService'
    ];

    function ShipmentViewController(shipment, shipmentService, loadingModalService, $state,
                                    confirmService, notificationService, stateTrackerService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.saveShipment = saveShipment;
        vm.deleteShipment = deleteShipment;

        /**
         * @ngdoc property
         * @propertyOf shipment-view.controller:ShipmentViewController
         * @name shipment
         * @type {Object}
         *
         * @description
         * Holds shipment that will be displayed on the screen.
         */
        vm.shipment = undefined;

        /**
         * @ngdoc method
         * @methodOf shipment-view.controller:ShipmentViewController
         * @name onInit
         *
         * @description
         * Initialization method called after the controller has been created. Responsible for
         * setting data to be available on the view.
         */
        function onInit() {
            vm.shipment = shipment;
        }

        /**
         * @ngdoc method
         * @methodOf shipment-view.controller:ShipmentViewController
         * @name saveShipment
         *
         * @description
         * Saves the shipment on the server. Will show a notification informing whether the action
         * was successful or not. Will reload the state on success.
         */
        function saveShipment() {
            var loadingPromise = loadingModalService.open();

            shipmentService.save(vm.shipment)
            .then(function() {
                loadingPromise
                .then(function() {
                    notificationService.success('shipmentView.shipmentHasBeenSaved');
                });
                $state.reload();
            })
            .catch(function() {
                loadingPromise
                .then(function() {
                    notificationService.error('shipmentView.failedToSaveShipment');
                });
                loadingModalService.close();
            });
        }

        /**
         * @ngdoc method
         * @methodOf shipment-view.controller:ShipmentViewController
         * @name saveShipment
         *
         * @description
         * Deletes the shipment on the server. Will show a notification informing whether the action
         * was successful or not. Will take user to the previous page on success.
         */
        function deleteShipment() {
            var loadingPromise = loadingModalService.open();

            confirmService.confirm(
                'shipmentView.deleteShipmentConfirmation',
                'shipmentView.delete'
            )
            .then(function() {
                return shipmentService.remove(vm.shipment.id)
                .then(function() {
                    loadingPromise
                    .then(function() {
                        notificationService.success('shipmentView.shipmentHasBeenDeleted');
                    });
                    stateTrackerService.goToPreviousState('openlmis.orders.view');
                })
                .catch(function() {
                    loadingPromise
                    .then(function() {
                        notificationService.error('shipmentView.failedToDeleteShipment');
                    });
                    loadingModalService.close();
                });
            })
            .catch(loadingModalService.close);
        }

    }

})();
