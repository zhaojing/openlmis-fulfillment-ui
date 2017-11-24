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
        .factory('OrderDataBuilder', OrderDataBuilder);

    OrderDataBuilder.$inject = ['Order', 'ProgramDataBuilder', 'FacilityDataBuilder', 'OrderableDataBuilder'];

    function OrderDataBuilder(Order, ProgramDataBuilder, FacilityDataBuilder, OrderableDataBuilder) {

        OrderDataBuilder.prototype.build = build;

        return OrderDataBuilder;

        function OrderDataBuilder() {
            this.id = 'ec49baf1-fb6c-4bbc-ad5e-54fff70115a2',
            this.emergency = true;
            this.createdDate = new Date(2017, 11, 10);
            this.program = new ProgramDataBuilder().build();
            this.requestingFacility = new FacilityDataBuilder().build();
            this.orderCode = "ORDER-00000000-0000-0000-0000-000000000009R";
            this.status = "IN_ROUTE";
            this.orderLineItems = [
                {
                    "orderedQuantity": 10,
                    "filledQuantity": 10,
                    "orderable": new OrderableDataBuilder().build()
                }
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
                this.orderLineItems
            );
        }

    }

})();
