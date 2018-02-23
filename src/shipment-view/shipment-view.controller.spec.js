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

ddescribe('ShipmentViewController', function() {

    var vm, $q, $controller, $rootScope, $state, $window, shipment, OrderDataBuilder, loadingModalService, shipmentService, ORDER_STATUS,
        confirmService, shipmentDraftService, notificationService, loadingDeferred, stateTrackerService, order, ShipmentDataBuilder,
        lineItem, ShipmentLineItemWithSummaryDataBuilder, shipmentLineItem;

    beforeEach(function() {
        module('shipment-view');

        inject(function($injector) {
            $q = $injector.get('$q');
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            $window = $injector.get('$window');
            OrderDataBuilder = $injector.get('OrderDataBuilder');
            ShipmentDataBuilder = $injector.get('ShipmentDataBuilder');
            shipmentDraftService = $injector.get('shipmentDraftService');
            shipmentService = $injector.get('shipmentService');
            confirmService = $injector.get('confirmService');
            loadingModalService = $injector.get('loadingModalService');
            notificationService = $injector.get('notificationService');
            stateTrackerService =  $injector.get('stateTrackerService');
            ORDER_STATUS = $injector.get('ORDER_STATUS');
            ShipmentLineItemWithSummaryDataBuilder = $injector.get('ShipmentLineItemWithSummaryDataBuilder');
        });

        shipmentLineItem = new ShipmentLineItemWithSummaryDataBuilder()
            .withQuantityShipped(10)
            .build();
        lineItem = {
            shipmentLineItems: [
                shipmentLineItem
            ]
        };
        order = new OrderDataBuilder().build();
        shipment = new ShipmentDataBuilder().withOrder(order);

        vm = $controller('ShipmentViewController', {
            $scope: $rootScope.$new(),
            shipment: shipment,
            orderFulfillmentLineItems: [lineItem],
            updatedOrder: order
        });

        loadingDeferred = $q.defer();

        spyOn(loadingModalService, 'close');
        spyOn(notificationService, 'success');
        spyOn(notificationService, 'error');
        spyOn($window, 'open').andCallThrough();

        spyOn(loadingModalService, 'open').andReturn(loadingDeferred.promise);
    });

    describe('onInit', function() {

        beforeEach(function() {
            vm.$onInit();
        });

        it('should expose order', function() {
            expect(vm.order).toEqual(shipment.order);
        });

        it('should expose order', function() {
            expect(vm.shipment).toEqual(shipment);
        });
    });

    describe('saveShipment', function() {

        var saveDeferred;

        beforeEach(function() {
            vm.$onInit();

            saveDeferred = $q.defer();

            spyOn($state, 'reload');
            spyOn(shipmentDraftService, 'save').andReturn(saveDeferred.promise);
        });

        it('should open loading modal', function() {
            vm.saveShipment();
            $rootScope.$apply();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(loadingModalService.close).not.toHaveBeenCalled();
        });

        it('should attempt to save shipment', function() {
            vm.saveShipment();
            $rootScope.$apply();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(shipmentDraftService.save).toHaveBeenCalledWith(shipment);
            expect(loadingModalService.close).not.toHaveBeenCalled();
            expect($state.reload).not.toHaveBeenCalled();
        });

        it('should reload page and let the state change close loading modal after shipment was successfully saved ', function() {
            vm.saveShipment();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(shipmentDraftService.save).toHaveBeenCalledWith(shipment);
            expect($state.reload).not.toHaveBeenCalled();

            saveDeferred.resolve();
            $rootScope.$apply();

            expect($state.reload).toHaveBeenCalled();
            expect(notificationService.error).not.toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(loadingModalService.close).not.toHaveBeenCalled();
        });

        it('should show notification after shipment was successfully saved and loading modal was closed', function() {
            vm.saveShipment();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(shipmentDraftService.save).toHaveBeenCalledWith(shipment);
            expect(loadingModalService.close).not.toHaveBeenCalled();
            expect($state.reload).not.toHaveBeenCalled();

            saveDeferred.resolve();
            $rootScope.$apply();

            expect($state.reload).toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();

            loadingDeferred.resolve();
            $rootScope.$apply();

            expect(notificationService.success)
            .toHaveBeenCalledWith('shipmentView.draftHasBeenSaved');
        });

        it('should close loading modal after shipment failed to save', function() {
            vm.saveShipment();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(shipmentDraftService.save).toHaveBeenCalledWith(shipment);
            expect(loadingModalService.close).not.toHaveBeenCalled();

            saveDeferred.reject();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
            expect($state.reload).not.toHaveBeenCalled();
        });

        it('should show notification after shipment failed to save and loading modal was closed', function() {
            vm.saveShipment();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(shipmentDraftService.save).toHaveBeenCalledWith(shipment);
            expect(loadingModalService.close).not.toHaveBeenCalled();

            saveDeferred.reject();
            $rootScope.$apply();

            expect(notificationService.success).not.toHaveBeenCalled();

            loadingDeferred.resolve();
            $rootScope.$apply();

            expect(notificationService.error)
            .toHaveBeenCalledWith('shipmentView.failedToSaveDraft');
            expect($state.reload).not.toHaveBeenCalled();
        });

    });

    describe('confirmShipment', function() {

        var saveDeferred, confirmDeferred;

        beforeEach(function() {
            vm.$onInit();

            saveDeferred = $q.defer();
            confirmDeferred = $q.defer();

            spyOn(stateTrackerService, 'goToPreviousState');
            spyOn(shipmentService, 'create').andReturn(saveDeferred.promise);
            spyOn(confirmService, 'confirm').andReturn(confirmDeferred.promise);
        });

        it('should open confirm modal', function() {
            vm.confirmShipment();
            $rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalled();
            expect(shipmentService.create).not.toHaveBeenCalled();
            expect(loadingModalService.open).not.toHaveBeenCalled();
        });

        it('should not call shipmentService if confirmation failed', function() {
            vm.confirmShipment();
            confirmDeferred.reject();
            $rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalled();
            expect(shipmentService.create).not.toHaveBeenCalled();
            expect(loadingModalService.open).not.toHaveBeenCalled();
        });

        it('should not call shipmentService if shipment is not valid', function() {
            lineItem.shipmentLineItems.push(new ShipmentLineItemWithSummaryDataBuilder()
                .withQuantityShipped(20)
                .build());

            var scope = $rootScope.$new();
            spyOn(scope, '$broadcast').andReturn();

            vm = $controller('ShipmentViewController', {
                $scope: scope,
                shipment: shipment,
                orderFulfillmentLineItems: [lineItem],
                updatedOrder: order
            });
            vm.$onInit();

            vm.confirmShipment();
            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(scope.$broadcast).toHaveBeenCalledWith('openlmis-form-submit');
            expect(confirmService.confirm).toHaveBeenCalled();
            expect(shipmentService.create).not.toHaveBeenCalled();
            expect(loadingModalService.open).not.toHaveBeenCalled();
        });

        it('should open loading modal', function() {
            vm.confirmShipment();
            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(loadingModalService.close).not.toHaveBeenCalled();
        });

        it('should attempt to create shipment', function() {
            vm.confirmShipment();
            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(shipmentService.create).toHaveBeenCalledWith(shipment);
            expect(loadingModalService.close).not.toHaveBeenCalled();
            expect(stateTrackerService.goToPreviousState).not.toHaveBeenCalled();
        });

        it('should reload page and let the state change close loading modal after shipment was successfully created', function() {
            vm.confirmShipment();
            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(shipmentService.create).toHaveBeenCalledWith(shipment);
            expect(stateTrackerService.goToPreviousState).not.toHaveBeenCalled();

            saveDeferred.resolve();
            $rootScope.$apply();

            expect(stateTrackerService.goToPreviousState).toHaveBeenCalled();
            expect(notificationService.error).not.toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(loadingModalService.close).not.toHaveBeenCalled();
        });

        it('should show notification after shipment was successfully created and loading modal was closed', function() {
            vm.confirmShipment();
            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(shipmentService.create).toHaveBeenCalledWith(shipment);
            expect(stateTrackerService.goToPreviousState).not.toHaveBeenCalled();

            saveDeferred.resolve();
            $rootScope.$apply();

            expect(stateTrackerService.goToPreviousState).toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();

            loadingDeferred.resolve();
            $rootScope.$apply();

            expect(notificationService.success)
            .toHaveBeenCalledWith('shipmentView.shipmentHasBeenConfirmed');
            expect(notificationService.error).not.toHaveBeenCalled();
            expect(loadingModalService.close).not.toHaveBeenCalled();
        });

        it('should close loading modal after shipment creation failed', function() {
            vm.confirmShipment();
            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(shipmentService.create).toHaveBeenCalledWith(shipment);
            expect(loadingModalService.close).not.toHaveBeenCalled();

            saveDeferred.reject();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
            expect(stateTrackerService.goToPreviousState).not.toHaveBeenCalled();
        });

        it('should show notification after shipment creation failed and loading modal was closed', function() {
            vm.confirmShipment();
            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(shipmentService.create).toHaveBeenCalledWith(shipment);
            expect(loadingModalService.close).not.toHaveBeenCalled();

            saveDeferred.reject();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
            expect(notificationService.error)
            .toHaveBeenCalledWith('shipmentView.failedToConfirmShipment');
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(stateTrackerService.goToPreviousState).not.toHaveBeenCalled();
        });
    });

    describe('deleteShipment', function() {

        var confirmDeferred, deleteDeferred;

        beforeEach(function() {
            vm.$onInit();

            confirmDeferred = $q.defer();
            deleteDeferred = $q.defer();

            spyOn(confirmService, 'confirmDestroy').andReturn(confirmDeferred.promise);
            spyOn(shipmentDraftService, 'remove').andReturn(deleteDeferred.promise);
            spyOn(stateTrackerService, 'goToPreviousState');
        });

        it('should open loading modal', function() {
            vm.deleteShipment();

            expect(loadingModalService.open).not.toHaveBeenCalled();

            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(loadingModalService.close).not.toHaveBeenCalled();
        });

        it('should ask for confirmation before doing anything', function() {
            vm.deleteShipment();

            expect(confirmService.confirmDestroy).toHaveBeenCalledWith(
                'shipmentView.deleteDraftConfirmation',
                'shipmentView.deleteDraft'
            );

            $rootScope.$apply();

            expect(shipmentDraftService.remove).not.toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(notificationService.error).not.toHaveBeenCalled();
            expect(loadingModalService.close).not.toHaveBeenCalled();
            expect(stateTrackerService.goToPreviousState).not.toHaveBeenCalled();
        });

        it('should do nothing if confirmation was dismissed', function() {
            vm.deleteShipment();

            expect(confirmService.confirmDestroy).toHaveBeenCalledWith(
                'shipmentView.deleteDraftConfirmation',
                'shipmentView.deleteDraft'
            );

            $rootScope.$apply();

            confirmDeferred.reject();
            $rootScope.$apply();

            expect(shipmentDraftService.remove).not.toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(notificationService.error).not.toHaveBeenCalled();
            expect(loadingModalService.open).not.toHaveBeenCalled();
            expect(loadingModalService.close).not.toHaveBeenCalled();
            expect(stateTrackerService.goToPreviousState).not.toHaveBeenCalled();
        });

        it('should attempt to delete shipment if confirmed', function() {
            vm.deleteShipment();

            expect(confirmService.confirmDestroy).toHaveBeenCalledWith(
                'shipmentView.deleteDraftConfirmation',
                'shipmentView.deleteDraft'
            );

            $rootScope.$apply();

            expect(shipmentDraftService.remove).not.toHaveBeenCalled();

            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(shipmentDraftService.remove).toHaveBeenCalledWith(shipment.id);
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(notificationService.error).not.toHaveBeenCalled();
            expect(loadingModalService.close).not.toHaveBeenCalled();
            expect(stateTrackerService.goToPreviousState).not.toHaveBeenCalled();
        });

        it('should close loading modal after shipment failed to delete', function() {
            vm.deleteShipment();

            expect(confirmService.confirmDestroy).toHaveBeenCalledWith(
                'shipmentView.deleteDraftConfirmation',
                'shipmentView.deleteDraft'
            );

            $rootScope.$apply();

            expect(shipmentDraftService.remove).not.toHaveBeenCalled();

            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(shipmentDraftService.remove).toHaveBeenCalledWith(shipment.id);

            deleteDeferred.reject();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(notificationService.error).toHaveBeenCalledWith('shipmentView.failedToDeleteDraft');
            expect(stateTrackerService.goToPreviousState).not.toHaveBeenCalled();
        });

        it('should show notification after shipment failed to delete and loading modal was closed', function() {
            vm.deleteShipment();

            expect(confirmService.confirmDestroy).toHaveBeenCalledWith(
                'shipmentView.deleteDraftConfirmation',
                'shipmentView.deleteDraft'
            );

            $rootScope.$apply();

            expect(shipmentDraftService.remove).not.toHaveBeenCalled();

            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(shipmentDraftService.remove).toHaveBeenCalledWith(shipment.id);

            deleteDeferred.reject();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();

            loadingDeferred.resolve();
            $rootScope.$apply();

            expect(notificationService.error)
            .toHaveBeenCalledWith('shipmentView.failedToDeleteDraft');
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(stateTrackerService.goToPreviousState).not.toHaveBeenCalled();
        });

        it('should take user back to the previous page after shipment was successfully deleted and let the state change close loading modal', function() {
            vm.deleteShipment();

            expect(confirmService.confirmDestroy).toHaveBeenCalledWith(
                'shipmentView.deleteDraftConfirmation',
                'shipmentView.deleteDraft'
            );

            $rootScope.$apply();

            expect(shipmentDraftService.remove).not.toHaveBeenCalled();

            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(shipmentDraftService.remove).toHaveBeenCalledWith(shipment.id);

            deleteDeferred.resolve();
            $rootScope.$apply();

            expect(stateTrackerService.goToPreviousState).toHaveBeenCalledWith(
                'openlmis.orders.view'
            );
            expect(loadingModalService.close).not.toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(notificationService.error).not.toHaveBeenCalled();
        });

        it('should show notification after shipment was successfully deleted and loading modal was closed', function() {
            vm.deleteShipment();

            expect(confirmService.confirmDestroy).toHaveBeenCalledWith(
                'shipmentView.deleteDraftConfirmation',
                'shipmentView.deleteDraft'
            );

            $rootScope.$apply();

            expect(shipmentDraftService.remove).not.toHaveBeenCalled();

            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(shipmentDraftService.remove).toHaveBeenCalledWith(shipment.id);
            expect(stateTrackerService.goToPreviousState).not.toHaveBeenCalled();

            deleteDeferred.resolve();
            $rootScope.$apply();

            expect(stateTrackerService.goToPreviousState).toHaveBeenCalledWith(
                'openlmis.orders.view'
            );

            loadingDeferred.resolve();
            $rootScope.$apply();

            expect(notificationService.success)
            .toHaveBeenCalledWith('shipmentView.draftHasBeenDeleted');
            expect(loadingModalService.close).not.toHaveBeenCalled();
            expect(notificationService.error).not.toHaveBeenCalled();
        });

    });

    describe('saveAndPrint', function() {

        var saveDeferred;

        beforeEach(function() {
            vm.$onInit();

            saveDeferred = $q.defer();

            spyOn($state, 'reload');
            spyOn(shipmentDraftService, 'save').andReturn(saveDeferred.promise);
        });

        it('should open loading modal', function() {
            vm.saveAndPrint();
            $rootScope.$apply();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(loadingModalService.close).not.toHaveBeenCalled();
        });

        it('should attempt to save shipment', function() {
            vm.saveAndPrint();
            $rootScope.$apply();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(shipmentDraftService.save).toHaveBeenCalledWith(shipment);
            expect(loadingModalService.close).not.toHaveBeenCalled();
            expect($state.reload).not.toHaveBeenCalled();
        });

        it('should reload page and open report window after shipment was successfully saved ', function() {
            vm.saveAndPrint();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(shipmentDraftService.save).toHaveBeenCalledWith(shipment);
            expect($state.reload).not.toHaveBeenCalled();

            saveDeferred.resolve(shipment);
            $rootScope.$apply();

            expect($state.reload).toHaveBeenCalled();
            expect($window.open).toHaveBeenCalled();
            expect(notificationService.error).not.toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(loadingModalService.close).not.toHaveBeenCalled();
        });

        it('should show notification after shipment was successfully saved and loading modal was closed', function() {
            vm.saveAndPrint();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(shipmentDraftService.save).toHaveBeenCalledWith(shipment);
            expect(loadingModalService.close).not.toHaveBeenCalled();
            expect($state.reload).not.toHaveBeenCalled();

            saveDeferred.resolve(shipment);
            $rootScope.$apply();

            expect($state.reload).toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();

            loadingDeferred.resolve();
            $rootScope.$apply();

            expect(notificationService.success)
            .toHaveBeenCalledWith('shipmentView.draftHasBeenSaved');
        });

        it('should close loading modal after shipment failed to save', function() {
            vm.saveAndPrint();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(shipmentDraftService.save).toHaveBeenCalledWith(shipment);
            expect(loadingModalService.close).not.toHaveBeenCalled();

            saveDeferred.reject();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
            expect($state.reload).not.toHaveBeenCalled();
        });

        it('should show notification after shipment failed to save and loading modal was closed', function() {
            vm.saveAndPrint();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(shipmentDraftService.save).toHaveBeenCalledWith(shipment);
            expect(loadingModalService.close).not.toHaveBeenCalled();

            saveDeferred.reject();
            $rootScope.$apply();

            expect(notificationService.success).not.toHaveBeenCalled();

            loadingDeferred.resolve();
            $rootScope.$apply();

            expect(notificationService.error)
            .toHaveBeenCalledWith('shipmentView.failedToSaveDraft');
            expect($state.reload).not.toHaveBeenCalled();
        });
    });

    describe('isEditable', function() {

        it('should check if shipment is editable', function() {
            vm.$onInit();

            vm.order.status = ORDER_STATUS.SHIPPED;
            expect(vm.isEditable()).toBe(false);

            vm.order.status = ORDER_STATUS.ORDERED;
            expect(vm.isEditable()).toBe(true);
        });
    });
});
