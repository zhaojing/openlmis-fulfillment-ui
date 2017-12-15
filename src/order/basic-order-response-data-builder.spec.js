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
        .factory('BasicOrderResponseDataBuilder', BasicOrderResponseDataBuilder);

    BasicOrderResponseDataBuilder.$inject = [
        'ProgramDataBuilder', 'FacilityDataBuilder', 'PeriodDataBuilder'
    ];

    function BasicOrderResponseDataBuilder(ProgramDataBuilder, FacilityDataBuilder,
                                           PeriodDataBuilder) {

        BasicOrderResponseDataBuilder.prototype.withId = withId;
        BasicOrderResponseDataBuilder.prototype.withCreatedDate = withCreatedDate;
        BasicOrderResponseDataBuilder.prototype.withLastUpdatedDate = withLastUpdatedDate;
        BasicOrderResponseDataBuilder.prototype.withProcessingPeriod = withProcessingPeriod;
        BasicOrderResponseDataBuilder.prototype.build = build;

        return BasicOrderResponseDataBuilder;

        function BasicOrderResponseDataBuilder() {
            BasicOrderResponseDataBuilder.instanceNumber = (BasicOrderResponseDataBuilder.instanceNumber || 0) + 1;

            this.id = 'order-id' + BasicOrderResponseDataBuilder.instanceNumber;
            this.emergency = true;
            this.createdDate = '2017-11-10T17:17:17Z';
            this.lastUpdatedDate = '2017-11-10T17:17:17Z';
            this.processingPeriod = new PeriodDataBuilder()
                .withStartDate('2017-11-10T17:17:17Z')
                .withEndDate('2017-11-10T17:17:17Z')
                .build();

            this.program = new ProgramDataBuilder().build();
            this.requestingFacility = new FacilityDataBuilder().build();
            this.orderCode = "ORDER-" + BasicOrderResponseDataBuilder.instanceNumber;
            this.status = "IN_ROUTE";
            this.facility = new FacilityDataBuilder().build();
            this.receivingFacility = new FacilityDataBuilder().build();
            this.supplyingFacility = new FacilityDataBuilder().build();
            this.lastUpdaterId = 'user-id' + BasicOrderResponseDataBuilder.instanceNumber;
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
            return {
                id: this.id,
                emergency: this.emergency,
                createdDate: this.createdDate,
                program: this.program,
                requestingFacility: this.requestingFacility,
                orderCode: this.orderCode,
                status: this.status,
                processingPeriod: this.processingPeriod,
                lastUpdatedDate: this.lastUpdatedDate,
                facility: this.facility,
                receivingFacility: this.receivingFacility,
                supplyingFacility: this.supplyingFacility,
                lastUpdaterId: this.lastUpdaterId
            };
        }

    }

})();
