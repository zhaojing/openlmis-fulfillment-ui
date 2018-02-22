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

describe('OrderLineItemController', function() {

    var vm, $controller, $scope, orderLineItem, proofOfDelivery, reasonAssignments,
        OrderLineItemDataBuilder, ValidReasonAssignmentDataBuilder, ProofOfDeliveryDataBuilder,
        ProofOfDeliveryLineItemDataBuilder;

    beforeEach(function() {
        module('proof-of-delivery-view');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            OrderLineItemDataBuilder = $injector.get('OrderLineItemDataBuilder');
            ValidReasonAssignmentDataBuilder = $injector.get('ValidReasonAssignmentDataBuilder');
            ProofOfDeliveryDataBuilder = $injector.get('ProofOfDeliveryDataBuilder');
            ProofOfDeliveryLineItemDataBuilder = $injector.get('ProofOfDeliveryLineItemDataBuilder');
        });

        orderLineItem = new OrderLineItemDataBuilder().build();

        reasonAssignments = [
            new ValidReasonAssignmentDataBuilder().build(),
            new ValidReasonAssignmentDataBuilder().build(),
            new ValidReasonAssignmentDataBuilder().build()
        ];

        proofOfDelivery = new ProofOfDeliveryDataBuilder()
            .withLineItems([
                new ProofOfDeliveryLineItemDataBuilder()
                    .withOrderable(orderLineItem.orderable)
                    .withRejectionReasonId(reasonAssignments[1].reason.id)
                    .build(),
                new ProofOfDeliveryLineItemDataBuilder().build(),
                new ProofOfDeliveryLineItemDataBuilder()
                    .withOrderable(orderLineItem.orderable)
                    .withRejectionReasonId(reasonAssignments[2].reason.id)
                    .build()
            ])
            .build();

        $scope = {
            orderLineItem: orderLineItem,
            proofOfDelivery: proofOfDelivery,
            reasonAssignments: reasonAssignments
        };

        vm = $controller('OrderLineItemController', {
            $scope: $scope
        });
    });

    describe('$onInit', function() {

        it('should expose order line item', function() {
            vm.$onInit();

            expect(vm.orderLineItem).toEqual(orderLineItem);
        });

        it('should expose filtered fulfilling line items', function() {
            vm.$onInit();

            expect(vm.fulfillingLineItems).toEqual([
                proofOfDelivery.lineItems[0],
                proofOfDelivery.lineItems[2]
            ]);
        });

        it('should expose reasonAssignments', function() {
            vm.$onInit();

            expect(vm.reasonAssignments).toEqual(reasonAssignments);
        });

        it('should expose proof of delivery', function() {
            vm.$onInit();

            expect(vm.proofOfDelivery).toEqual(proofOfDelivery);
        });

        it('should check if VVM Status column should be shown', function() {
            vm.$onInit();

            expect(vm.showVvmColumn).toEqual(proofOfDelivery.checkIfProductsUseVvmStatus());
        });
    });

    describe('getReasonName', function() {

        beforeEach(function() {
            vm.$onInit();
        });

        it('should return name for reason ID', function() {
            var result = vm.getReasonName(vm.fulfillingLineItems[1].rejectionReasonId);

            expect(result).toEqual(reasonAssignments[2].reason.name);
        });

        it('should return undefined if ID is not given', function() {
            expect(vm.getReasonName()).toBeUndefined();
        });

        it('should throw exception if reason with the given ID does not exist', function() {
            expect(function() {
                vm.getReasonName('some-other-id');
            }).toThrow();
        });

    });

});
