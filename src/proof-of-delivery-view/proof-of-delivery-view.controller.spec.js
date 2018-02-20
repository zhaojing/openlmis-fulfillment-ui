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

describe('PodViewController', function() {

    var vm, $controller, ProofOfDeliveryDataBuilder, OrderDataBuilder, proofOfDelivery, order,
        reasonAssignments, ValidReasonAssignmentDataBuilder, VVM_STATUS, messageService;

    beforeEach(function() {
        module('proof-of-delivery-view');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            OrderDataBuilder = $injector.get('OrderDataBuilder');
            ProofOfDeliveryDataBuilder = $injector.get('ProofOfDeliveryDataBuilder');
            ValidReasonAssignmentDataBuilder = $injector.get('ValidReasonAssignmentDataBuilder');
            VVM_STATUS = $injector.get('VVM_STATUS');
            messageService = $injector.get('messageService');
        });

        proofOfDelivery = new ProofOfDeliveryDataBuilder().build();
        order = new OrderDataBuilder().build();
        reasonAssignments = [
            ValidReasonAssignmentDataBuilder.buildWithDebitReason(),
            ValidReasonAssignmentDataBuilder.buildWithDebitReason()
        ];

        spyOn(messageService, 'get').andCallFake(function(messageKey) {
            return messageKey;
        });

        vm = $controller('ProofOfDeliveryViewController', {
            proofOfDelivery: proofOfDelivery,
            order: order,
            reasonAssignments: reasonAssignments
        });
    });

    it('it should expose Proof of Delivery', function() {
        vm.$onInit();

        expect(vm.proofOfDelivery).toBe(proofOfDelivery);
    });

    it('it should expose Order', function() {
        vm.$onInit();

        expect(vm.order).toBe(order);
    });

    it('should expose reasonAssignments', function() {
        vm.$onInit();

        expect(vm.reasonAssignments).toBe(reasonAssignments);
    });

    describe('getStatusDisplay', function() {

        it('should get display for vvm status', function() {
            expect(vm.getStatusDisplay(VVM_STATUS.STAGE_1)).toBe('stockConstants.stage1');
            expect(vm.getStatusDisplay(VVM_STATUS.STAGE_2)).toBe('stockConstants.stage2');
        });
    });
});
