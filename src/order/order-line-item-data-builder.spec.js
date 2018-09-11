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
        .module('order')
        .factory('OrderLineItemDataBuilder', OrderLineItemDataBuilder);

    OrderLineItemDataBuilder.$inject = ['OrderableDataBuilder'];

    function OrderLineItemDataBuilder(OrderableDataBuilder) {

        OrderLineItemDataBuilder.prototype.withOrderable = withOrderable;
        OrderLineItemDataBuilder.prototype.build = build;

        return OrderLineItemDataBuilder;

        function OrderLineItemDataBuilder() {
            OrderLineItemDataBuilder.instanceNumber = (OrderLineItemDataBuilder.instanceNumber || 0) + 1;

            this.id = 'order-line-item-' + OrderLineItemDataBuilder.instanceNumber;
            this.filledQuantity = 40 + OrderLineItemDataBuilder.instanceNumber;
            this.orderable = new OrderableDataBuilder().build();
            this.orderedQuantity = 30 + OrderLineItemDataBuilder.instanceNumber;
        }

        function withOrderable(orderable) {
            this.orderable = orderable;
            return this;
        }

        function build() {
            return {
                id: this.id,
                filledQuantity: this.filledQuantity,
                orderable: this.orderable,
                orderedQuantity: this.orderedQuantity
            };
        }
    }
})();
