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

describe('ShipmentViewController', function() {

    var vm, $q, $controller, $rootScope, $state, $window, shipment, OrderDataBuilder, loadingModalService,
        confirmService, shipmentService, notificationService, loadingDeferred, stateTrackerService;

    beforeEach(function() {
        module('shipment-view');

        inject(function($injector) {
            $q = $injector.get('$q');
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            $window = $injector.get('$window');
            OrderDataBuilder = $injector.get('OrderDataBuilder');
            shipmentService = $injector.get('shipmentService');
            confirmService = $injector.get('confirmService');
            loadingModalService = $injector.get('loadingModalService');
            notificationService = $injector.get('notificationService');
            stateTrackerService = $injector.get('stateTrackerService');
        });

        shipment = new OrderDataBuilder().build();

        vm = $controller('ShipmentViewController', {
            shipment: shipment
        });

        loadingDeferred = $q.defer();

        spyOn(loadingModalService, 'close');
        spyOn(notificationService, 'success');
        spyOn(notificationService, 'error');
        spyOn($window, 'open').andCallThrough();

        spyOn(loadingModalService, 'open').andReturn(loadingDeferred.promise);
    });

    describe('onInit', function() {

        it('should expose order', function() {
            vm.$onInit();
            expect(vm.order).toEqual(shipment.order);
        });

    });

    describe('saveShipment', function() {

        var saveDeferred;

        beforeEach(function() {
            vm.$onInit();

            saveDeferred = $q.defer();

            spyOn($state, 'reload');
            spyOn(shipmentService, 'save').andReturn(saveDeferred.promise);
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
            expect(shipmentService.save).toHaveBeenCalledWith(shipment);
            expect(loadingModalService.close).not.toHaveBeenCalled();
            expect($state.reload).not.toHaveBeenCalled();
        });

        it('should reload page and let the state change close loading modal after shipment was successfully saved ', function() {
            vm.saveShipment();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(shipmentService.save).toHaveBeenCalledWith(shipment);
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
            expect(shipmentService.save).toHaveBeenCalledWith(shipment);
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
            expect(shipmentService.save).toHaveBeenCalledWith(shipment);
            expect(loadingModalService.close).not.toHaveBeenCalled();

            saveDeferred.reject();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
            expect($state.reload).not.toHaveBeenCalled();
        });

        it('should show notification after shipment failed to save and loading modal was closed', function() {
            vm.saveShipment();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(shipmentService.save).toHaveBeenCalledWith(shipment);
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

    describe('deleteShipment', function() {

        var confirmDeferred, deleteDeferred;

        beforeEach(function() {
            vm.$onInit();

            confirmDeferred = $q.defer();
            deleteDeferred = $q.defer();

            spyOn(confirmService, 'confirm').andReturn(confirmDeferred.promise);
            spyOn(shipmentService, 'remove').andReturn(deleteDeferred.promise);
            spyOn(stateTrackerService, 'goToPreviousState');
        });

        it('should open loading modal', function() {
            vm.deleteShipment();

            expect(loadingModalService.open).toHaveBeenCalled();

            $rootScope.$apply();

            expect(loadingModalService.close).not.toHaveBeenCalled();
        });

        it('should ask for confirmation before doing anything', function() {
            vm.deleteShipment();

            expect(confirmService.confirm).toHaveBeenCalledWith(
                'shipmentView.deleteDraftConfirmation',
                'shipmentView.deleteDraft'
            );

            $rootScope.$apply();

            expect(shipmentService.remove).not.toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(notificationService.error).not.toHaveBeenCalled();
            expect(loadingModalService.close).not.toHaveBeenCalled();
            expect(stateTrackerService.goToPreviousState).not.toHaveBeenCalled();
        });

        it('should do nothing but close loading modal if confirmation was dismissed', function() {
            vm.deleteShipment();

            expect(confirmService.confirm).toHaveBeenCalledWith(
                'shipmentView.deleteDraftConfirmation',
                'shipmentView.deleteDraft'
            );

            $rootScope.$apply();

            expect(loadingModalService.close).not.toHaveBeenCalled();

            confirmDeferred.reject();
            loadingDeferred.resolve();
            $rootScope.$apply();

            expect(shipmentService.remove).not.toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(notificationService.error).not.toHaveBeenCalled();
            expect(loadingModalService.close).toHaveBeenCalled();
            expect(stateTrackerService.goToPreviousState).not.toHaveBeenCalled();
        });

        it('should attempt to delete shipment if confirmed', function() {
            vm.deleteShipment();

            expect(confirmService.confirm).toHaveBeenCalledWith(
                'shipmentView.deleteDraftConfirmation',
                'shipmentView.deleteDraft'
            );

            $rootScope.$apply();

            expect(shipmentService.remove).not.toHaveBeenCalled();

            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(shipmentService.remove).toHaveBeenCalledWith(shipment.id);
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(notificationService.error).not.toHaveBeenCalled();
            expect(loadingModalService.close).not.toHaveBeenCalled();
            expect(stateTrackerService.goToPreviousState).not.toHaveBeenCalled();
        });

        it('should close loading modal after shipment failed to delete', function() {
            vm.deleteShipment();

            expect(confirmService.confirm).toHaveBeenCalledWith(
                'shipmentView.deleteDraftConfirmation',
                'shipmentView.deleteDraft'
            );

            $rootScope.$apply();

            expect(shipmentService.remove).not.toHaveBeenCalled();

            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(shipmentService.remove).toHaveBeenCalledWith(shipment.id);

            deleteDeferred.reject();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(notificationService.error).not.toHaveBeenCalled();
            expect(stateTrackerService.goToPreviousState).not.toHaveBeenCalled();
        });

        it('should show notification after shipment failed to delete and loading modal was closed', function() {
            vm.deleteShipment();

            expect(confirmService.confirm).toHaveBeenCalledWith(
                'shipmentView.deleteDraftConfirmation',
                'shipmentView.deleteDraft'
            );

            $rootScope.$apply();

            expect(shipmentService.remove).not.toHaveBeenCalled();

            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(shipmentService.remove).toHaveBeenCalledWith(shipment.id);

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

            expect(confirmService.confirm).toHaveBeenCalledWith(
                'shipmentView.deleteDraftConfirmation',
                'shipmentView.deleteDraft'
            );

            $rootScope.$apply();

            expect(shipmentService.remove).not.toHaveBeenCalled();

            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(shipmentService.remove).toHaveBeenCalledWith(shipment.id);

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

            expect(confirmService.confirm).toHaveBeenCalledWith(
                'shipmentView.deleteDraftConfirmation',
                'shipmentView.deleteDraft'
            );

            $rootScope.$apply();

            expect(shipmentService.remove).not.toHaveBeenCalled();

            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(shipmentService.remove).toHaveBeenCalledWith(shipment.id);
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
            spyOn(shipmentService, 'save').andReturn(saveDeferred.promise);
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
            expect(shipmentService.save).toHaveBeenCalledWith(shipment);
            expect(loadingModalService.close).not.toHaveBeenCalled();
            expect($state.reload).not.toHaveBeenCalled();
        });

        it('should reload page and open report window after shipment was successfully saved ', function() {
            vm.saveAndPrint();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(shipmentService.save).toHaveBeenCalledWith(shipment);
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
            expect(shipmentService.save).toHaveBeenCalledWith(shipment);
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
            expect(shipmentService.save).toHaveBeenCalledWith(shipment);
            expect(loadingModalService.close).not.toHaveBeenCalled();

            saveDeferred.reject();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
            expect($state.reload).not.toHaveBeenCalled();
        });

        it('should show notification after shipment failed to save and loading modal was closed', function() {
            vm.saveAndPrint();

            expect(loadingModalService.open).toHaveBeenCalled();
            expect(shipmentService.save).toHaveBeenCalledWith(shipment);
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
});
