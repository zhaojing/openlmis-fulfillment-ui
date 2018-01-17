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
        '$scope', 'order', 'shipment', 'orderFulfillmentLineItems', 'shipmentDraftService', 'shipmentService',
        'loadingModalService', '$state', '$window', 'fulfillmentUrlFactory', 'messageService',
        'confirmService', 'notificationService', 'stateTrackerService', 'accessTokenFactory', 'ORDER_STATUS'
    ];

    function ShipmentViewController($scope, order, shipment, orderFulfillmentLineItems, shipmentDraftService, shipmentService,
                                    loadingModalService, $state, $window, fulfillmentUrlFactory, messageService,
                                    confirmService, notificationService, stateTrackerService, accessTokenFactory, ORDER_STATUS) {

        var vm = this;

        vm.$onInit = onInit;
        vm.saveShipment = saveShipment;
        vm.deleteShipment = deleteShipment;
        vm.saveAndPrint = saveAndPrint;
        vm.confirmShipment = confirmShipment;
        vm.isEditable = isEditable;

        /**
         * @ngdoc property
         * @propertyOf shipment-view.controller:ShipmentViewController
         * @name order
         * @type {Object}
         *
         * @description
         * Holds order that will be displayed on the screen.
         */
        vm.order = undefined;

        /**
         * @ngdoc property
         * @propertyOf shipment-view.controller:ShipmentViewController
         * @name orderFulfillmentLineItems
         * @type {Array}
         *
         * @description
         * Holds order line items that will be displayed on the screen.
         */
        vm.orderFulfillmentLineItems = undefined;

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
            vm.order = order;
            vm.orderFulfillmentLineItems = orderFulfillmentLineItems;
        }

        /**
         * @ngdoc method
         * @methodOf shipment-view.controller:ShipmentViewController
         * @name isEditable
         *
         * @description
         * Checks Order status which indicates if shipment can be edited.
         *
         * @return {boolean} is Shipment editable
         */
        function isEditable() {
            return ORDER_STATUS.SHIPPED !== vm.order.status;
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

            shipmentDraftService.save(shipment)
            .then(function() {
                loadingPromise
                .then(function() {
                    notificationService.success('shipmentView.draftHasBeenSaved');
                });
                $state.reload();
            })
            .catch(function() {
                loadingPromise
                .then(function() {
                    notificationService.error('shipmentView.failedToSaveDraft');
                });
                loadingModalService.close();
            });
        }

        /**
         * @ngdoc method
         * @methodOf shipment-view.controller:ShipmentViewController
         * @name confirmShipment
         *
         * @description
         * Finalizes the shipment on the server. Will show a notification informing whether the action
         * was successful or not and reload the state on success.
         */
        function confirmShipment() {
            confirmService.confirm(
                'shipmentView.confirmShipment.question',
                'shipmentView.confirmShipment'
            )
            .then(function() {
                if (isShipmentValid()) {
                    var loadingPromise = loadingModalService.open();
                    shipmentService.create(shipment)
                    .then(function() {
                        loadingPromise
                        .then(function() {
                            notificationService.success('shipmentView.shipmentHasBeenConfirmed');
                        });
                        stateTrackerService.goToPreviousState('openlmis.orders.view');
                    })
                    .catch(function() {
                        loadingPromise
                        .then(function() {
                            notificationService.error('shipmentView.failedToConfirmShipment');
                        });
                        loadingModalService.close();
                    });
                }
                else {
                    $scope.$broadcast('openlmis-form-submit');
                    notificationService.error('shipmentView.shipmentHasErrors');
                }
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
            confirmService.confirm(
                'shipmentView.deleteDraftConfirmation',
                'shipmentView.deleteDraft'
            )
            .then(function() {
                var loadingPromise = loadingModalService.open();
                return shipmentDraftService.remove(shipment.id)
                .then(function() {
                    loadingPromise
                    .then(function() {
                        notificationService.success('shipmentView.draftHasBeenDeleted');
                    });
                    stateTrackerService.goToPreviousState('openlmis.orders.view');
                })
                .catch(function() {
                    loadingPromise
                    .then(function() {
                        notificationService.error('shipmentView.failedToDeleteDraft');
                    });
                    loadingModalService.close();
                });
            });
        }

        /**
         * @ngdoc method
         * @methodOf shipment-view.controller:ShipmentViewController
         * @name saveAndPrint
         *
         * @description
         * Saves the shipment on the server and prints the report.
         */
        function saveAndPrint() {
            var popup = $window.open('', '_blank');
            popup.document.write(messageService.get('shipmentView.saveDraftPending'));

            var loadingPromise = loadingModalService.open();
            shipmentDraftService.save(shipment)
            .then(function(response) {
                loadingPromise
                .then(function() {
                    notificationService.success('shipmentView.draftHasBeenSaved');
                });
                popup.location.href = accessTokenFactory.addAccessToken(getPrintUrl(response.id));
                $state.reload();
            })
            .catch(function() {
                notificationService.error('shipmentView.failedToSaveDraft');
                loadingModalService.close();
            });
        }

        function isShipmentValid() {
            var isValid = true;
            vm.orderFulfillmentLineItems.forEach(function(orderLineItem) {
                orderLineItem.shipmentLineItems.forEach(function(lineItem) {
                    isValid = lineItem.validate() && isValid;
                });
            });
            return isValid;
        }

        function getPrintUrl(shipmentId) {
            return fulfillmentUrlFactory('/api/reports/templates/common/583ccc35-88b7-48a8-9193-6c4857d3ff60/pdf?shipmentDraftId=' + shipmentId);
        }
    }
})();
