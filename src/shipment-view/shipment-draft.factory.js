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

    angular
        .module('shipment-view')
        .factory('shipmentDraftFactory', shipmentDraftFactory);

    shipmentDraftFactory.$inject = [
        'shipmentDraftService', 'ShipmentDraft', 'confirmService', 'notificationService'
    ];

    function shipmentDraftFactory(shipmentDraftService, ShipmentDraft, confirmService) {
        var shipmentDraftFactory = {};

        shipmentDraftFactory.getForOrder = getForOrder;

        return shipmentDraftFactory;

        function getForOrder(orderId) {
            return shipmentDraftService.getForOrder(orderId)
            .then(function(response) {
                return new ShipmentDraft(response);
            })
            .then(addConfirmationAndNotification);
        }

        function addConfirmationAndNotification(shipmentDraft) {
            addNotifications(shipmentDraft);
            addConfirmation(shipmentDraft);
            return shipmentDraft;
        }

        function addConfirmation(shipmentDraft) {
            var finalize = shipmentDraft.finalize;

            shipmentDraft.finalize = function() {
                return confirmService.confirm('test', 'test')
                .then(function() {
                    return finalize.apply(shipmentDraft, arguments);
                });
            };
        }

        function addNotifications(shipmentDraft) {
            var finalize = shipmentDraft.finalize;

            shipmentDraft.finalize = function() {
                return finalize.apply(shipmentDraft, arguments)
                .then(function(response) {
                    notificationService.success('It\'s working!');
                    return response;
                })
                .catch(function() {
                    notificationService.error('It\'s not working!');
                });
            };
        }
    }

})();
