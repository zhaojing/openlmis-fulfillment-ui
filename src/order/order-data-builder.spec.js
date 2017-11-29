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

    OrderDataBuilder.$inject = ['Order', 'ProgramDataBuilder', 'FacilityDataBuilder', 'OrderableDataBuilder',
        'PeriodDataBuilder'];

    function OrderDataBuilder(Order, ProgramDataBuilder, FacilityDataBuilder, OrderableDataBuilder,
        PeriodDataBuilder) {

        OrderDataBuilder.prototype.withId = withId;
        OrderDataBuilder.prototype.withCreatedDate = withCreatedDate;
        OrderDataBuilder.prototype.withLastUpdatedDate = withLastUpdatedDate;
        OrderDataBuilder.prototype.withProcessingPeriod = withProcessingPeriod;
        OrderDataBuilder.prototype.build = build;

        return OrderDataBuilder;

        function OrderDataBuilder() {
            OrderDataBuilder.instanceNumber = (OrderDataBuilder.instanceNumber || 0) + 1;

            this.id = 'order-id' + OrderDataBuilder.instanceNumber;
            this.emergency = true;
            this.createdDate = new Date(2017, 11, 10);
            this.lastUpdatedDate = new Date(2017, 11, 10);
            this.processingPeriod = new PeriodDataBuilder().build();
            this.program = new ProgramDataBuilder().build();
            this.requestingFacility = new FacilityDataBuilder().build();
            this.orderCode = "ORDER-" + OrderDataBuilder.instanceNumber;
            this.status = "IN_ROUTE";
            this.orderLineItems = [
                {
                    "orderedQuantity": 10,
                    "filledQuantity": 10,
                    "orderable": new OrderableDataBuilder().build()
                }
            ];
            this.facility = new FacilityDataBuilder().build();
            this.receivingFacility = new FacilityDataBuilder().build();
            this.supplyingFacility = new FacilityDataBuilder().build();
            this.lastUpdaterId = 'user-id' + OrderDataBuilder.instanceNumber;
        }

        function withId(newId) {
            this.id = newId;
            return this;
        }

        function withCreatedDate(newDate) {
            this.createdDate = newDate;
            return this;
        }

        function withLastUpdatedDate(newDate) {
            this.lastUpdatedDate = newDate;
            return this;
        }

        function withProcessingPeriod(newPeriod) {
            this.processingPeriod = newPeriod;
            return this;
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
                this.orderLineItems,
                this.processingPeriod,
                this.lastUpdatedDate,
                this.facility,
                this.receivingFacility,
                this.supplyingFacility,
                this.lastUpdaterId
            );
        }

    }

})();
