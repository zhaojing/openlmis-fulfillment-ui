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
        .factory('OrderResponseDataBuilder', OrderResponseDataBuilder);

    OrderResponseDataBuilder.$inject = [
        'BasicOrderResponseDataBuilder', 'OrderLineItemDataBuilder', 'Order', 'classExtender'
    ];

    function OrderResponseDataBuilder(BasicOrderResponseDataBuilder,  OrderLineItemDataBuilder,
                                      Order, classExtender) {

        classExtender.extend(OrderResponseDataBuilder, BasicOrderResponseDataBuilder);

        OrderResponseDataBuilder.prototype.build = build;

        return OrderResponseDataBuilder;

        function OrderResponseDataBuilder() {
            BasicOrderResponseDataBuilder.apply(this, arguments);
            this.orderLineItems = [
                new OrderLineItemDataBuilder().build(),
                new OrderLineItemDataBuilder().build()
            ];
        }

        function build() {
            return new Order(
                this.id,
                this.emergency,
                this.createdDate,
                this.program,
                this.requestingFacility,
                this.orderCode,
                this.status,
                this.processingPeriod,
                this.lastUpdatedDate,
                this.facility,
                this.receivingFacility,
                this.supplyingFacility,
                this.lastUpdaterId,
                this.orderLineItems
            );
        }


    }

})();
