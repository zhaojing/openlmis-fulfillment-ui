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
        reasonAssignments, ValidReasonAssignmentDataBuilder, VVM_STATUS, messageService,
        fulfillingLineItems, fulfillmentUrlFactoryMock, $window, $rootScope, $q, deferred,
        loadingModalService, loadingDeferred, notificationService;

    beforeEach(function() {
        module('proof-of-delivery-view');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $window = $injector.get('$window');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            deferred = $q.defer();
            OrderDataBuilder = $injector.get('OrderDataBuilder');
            ProofOfDeliveryDataBuilder = $injector.get('ProofOfDeliveryDataBuilder');
            ValidReasonAssignmentDataBuilder = $injector.get('ValidReasonAssignmentDataBuilder');
            VVM_STATUS = $injector.get('VVM_STATUS');
            messageService = $injector.get('messageService');
            loadingModalService = $injector.get('loadingModalService');
            notificationService = $injector.get('notificationService');
        });

        proofOfDelivery = new ProofOfDeliveryDataBuilder().build();
        order = new OrderDataBuilder().build();
        reasonAssignments = [
            new ValidReasonAssignmentDataBuilder().build(),
            new ValidReasonAssignmentDataBuilder().build(),
            new ValidReasonAssignmentDataBuilder().build()
        ];
        fulfillingLineItems = {};
        fulfillingLineItems[order.orderLineItems[0]] = proofOfDelivery.lineItems;

        spyOn(messageService, 'get');

        vm = $controller('ProofOfDeliveryViewController', {
            proofOfDelivery: proofOfDelivery,
            order: order,
            reasonAssignments: reasonAssignments,
            fulfillingLineItems: fulfillingLineItems,
            canEdit: true
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

    it('should check if VVM Status column should be shown', function() {
        vm.$onInit();

        expect(vm.showVvmColumn).toEqual(proofOfDelivery.hasProductsUseVvmStatus());
    });

    it('should expose map of fulfilling line items', function() {
        vm.$onInit();

        expect(vm.fulfillingLineItems).toEqual(fulfillingLineItems);
    });

    it('should expose canEdit', function() {
        vm.$onInit();
        expect(vm.canEdit).toEqual(true);

        vm = $controller('ProofOfDeliveryViewController', {
            proofOfDelivery: proofOfDelivery,
            order: order,
            reasonAssignments: reasonAssignments,
            fulfillingLineItems: fulfillingLineItems,
            canEdit: false
        });
        vm.$onInit();
        expect(vm.canEdit).toEqual(false);
    });

    describe('getStatusDisplay', function() {

        beforeEach(function() {
            vm.$onInit();
        });

        it('should return translated message', function() {
            messageService.get.andReturn('translated message');

            var result = vm.getStatusDisplayName(VVM_STATUS.STAGE_1);

            expect(result).toBe('translated message');
            expect(messageService.get)
                .toHaveBeenCalledWith(VVM_STATUS.$getDisplayName(VVM_STATUS.STAGE_1));
        });

    });

    describe('getReasonName', function() {

        beforeEach(function() {
            vm.$onInit();
        });

        it('should return name for reason ID', function() {
            var result = vm.getReasonName(reasonAssignments[2].reason.id);

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

    describe('printPod', function() {

        beforeEach(function() {
            fulfillmentUrlFactoryMock = jasmine.createSpy();
            fulfillmentUrlFactoryMock.andCallFake(function(url) {
                return 'http://some.url' + url;
            });

            vm = $controller('ProofOfDeliveryViewController', {
                proofOfDelivery: proofOfDelivery,
                order: order,
                reasonAssignments: reasonAssignments,
                fulfillingLineItems: fulfillingLineItems,
                fulfillmentUrlFactory: fulfillmentUrlFactoryMock,
                canEdit: true
            });

            loadingDeferred = $q.defer();

            spyOn(loadingModalService, 'close');
            spyOn(notificationService, 'success');
            spyOn(notificationService, 'error');
            spyOn($window, 'open').andCallThrough();

            spyOn(loadingModalService, 'open').andReturn(loadingDeferred.promise);

            spyOn(proofOfDelivery, 'save');
            spyOn(proofOfDelivery, 'isInitiated');

            proofOfDelivery.isInitiated.andReturn(true);

            vm.$onInit();
        });

        it('should open loading modal', function() {
            proofOfDelivery.save.andReturn(deferred.promise);

            vm.printPod();
            $rootScope.$apply();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(loadingModalService.close).not.toHaveBeenCalled();
        });

        it('should attempt to save proof of delivery', function() {
            proofOfDelivery.save.andReturn(deferred.promise);

            vm.printPod();
            $rootScope.$apply();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(vm.proofOfDelivery.save).toHaveBeenCalled();
            expect(loadingModalService.close).not.toHaveBeenCalled();
        });

        it('should open window after proof of delivery was successfully saved', function() {
            proofOfDelivery.save.andReturn(deferred.promise);

            vm.printPod();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(vm.proofOfDelivery.save).toHaveBeenCalled();

            deferred.resolve(proofOfDelivery);
            $rootScope.$apply();

            expect($window.open).toHaveBeenCalled();
            expect(notificationService.error).not.toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(loadingModalService.close).toHaveBeenCalled();
        });

        it('should close loading modal after pod failed to save', function() {
            proofOfDelivery.save.andReturn(deferred.promise);

            vm.printPod();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(vm.proofOfDelivery.save).toHaveBeenCalled();
            expect(loadingModalService.close).not.toHaveBeenCalled();

            deferred.reject();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
        });

        it('should not call save if pod is confirmed', function () {
            proofOfDelivery.isInitiated.andReturn(false);

            vm.printPod();

            expect(loadingModalService.open).not.toHaveBeenCalled();
            expect(vm.proofOfDelivery.save).not.toHaveBeenCalled();
            expect($window.open).toHaveBeenCalled();
        });
    });
});
