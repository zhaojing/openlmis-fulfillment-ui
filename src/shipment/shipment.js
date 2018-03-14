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
     * @name shipment.Shipment
     *
     * @description
     * Represents a single shipment.
     */
    angular
        .module('shipment')
        .factory('Shipment', Shipment);

    Shipment.$inject = [
        'ShipmentLineItem', 'ORDER_STATUS', '$q', '$window', 'accessTokenFactory',
        'fulfillmentUrlFactory', 'messageService'
    ];

    function Shipment(ShipmentLineItem, ORDER_STATUS, $q, $window, accessTokenFactory,
                      fulfillmentUrlFactory, messageService) {

        Shipment.prototype.canBeConfirmed = canBeConfirmed;
        Shipment.prototype.isEditable = isEditable;
        Shipment.prototype.save = save;
        Shipment.prototype.confirm = confirm;
        Shipment.prototype.delete = deleteDraft;
        Shipment.prototype.print = print;
        Shipment.prototype.validate = validate;

        return Shipment;

        function Shipment(json, repository) {
            angular.copy(json, this);
            this.repository = repository;

            this.lineItems = json.lineItems.map(function(lineItemJson) {
                return new ShipmentLineItem(lineItemJson);
            });
        }

        function save() {
            if (!this.isEditable()) {
                return $q.reject();
            }
            return this.repository.updateDraft(this);
        }

        function confirm() {
            if (this.validate() || !this.isEditable()) {
                return $q.reject();
            }

            return this.repository.create(this);
        }

        function deleteDraft() {
            if (!this.isEditable()) {
                return $q.reject();
            }
            return this.repository.deleteDraft(this);
        }

        function print() {
            var popup = $window.open('', '_blank');
            popup.document.write(messageService.get('shipmentView.saveDraftPending'));

            return save.apply(this)
            .then(function(response) {
                popup.location.href = accessTokenFactory.addAccessToken(getPrintUrl(response.id));
            });
        }

        function validate() {
            var errors = {};

            var lineItemsErrors = [];
            this.lineItems.forEach(function(lineItem) {
                var lineItemErrors = lineItem.validate();

                if (lineItemErrors) {
                    lineItemsErrors.push(lineItemErrors);
                }
            });

            if (lineItemsErrors.length) {
                errors.lineItems = lineItemsErrors;
            }

            return angular.equals(errors, {}) ? undefined : errors;
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
            return ORDER_STATUS.ORDERED === this.order.status ||
                ORDER_STATUS.FULFILLING === this.order.status;
        }

        /**
         * @ngdoc method
         * @methodOf shipment.Shipment
         * @name canBeConfirmed
         *
         * @description
         * Returns true if shipment can be confirmed.
         */
        function canBeConfirmed() {
            return this.lineItems.length > 0;
        }

        function getPrintUrl(shipmentId) {
            return fulfillmentUrlFactory('/api/reports/templates/common/583ccc35-88b7-48a8-9193-6c4857d3ff60/pdf?shipmentDraftId=' + shipmentId);
        }
    }

})();
