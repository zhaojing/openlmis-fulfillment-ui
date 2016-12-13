/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe('RequisitionService', function() {

    var $rootScope, $httpBackend, requisitionService, requisitionFactory, dateUtils, confirm, q,
        allStatuses, requisitionUrl, openlmisUrl, RequisitionStorage,
        startDate = [2016, 4, 30, 16, 21, 33],
        endDate = [2016, 4, 30, 16, 21, 33],
        startDate1 = new Date(),
        endDate1 = new Date(),
        modifiedDate = [2016, 4, 30, 16, 21, 33],
        createdDate = [2016, 4, 30, 16, 21, 33],
        processingSchedule = {
            modifiedDate: modifiedDate
        },
        facility = {
            id: '1',
            name: 'facility1'
        },
        program = {
            id: '1',
            name: 'program1'
        },
        period = {
            id: '1',
            startDate: startDate,
            endDate: endDate,
            processingSchedule: processingSchedule
        },
        emergency = false,
        requisition = {
            id: '1',
            name: 'requisition',
            status: 'INITIATED',
            facilityId: facility.id,
            programId: program.id,
            processingPeriodId: period.id,
            createdDate: createdDate,
            supplyingFacility: '2',
            program: {
                id: 'program-id'
            },
            facility: {
                id: 'facility-id'
            }
        },
        requisitionDto = {
            id: '2',
            name: 'requisitionDto',
            status: 'INITIATED',
            facility: facility,
            program: program,
            processingPeriod: period,
            createdDate: createdDate
        },
        requisitionDto2 = {
            id: '3',
            name: 'requisitionDto',
            status: 'INITIATED',
            facility: facility,
            program: program,
            processingPeriod: period,
            createdDate: createdDate
        },
        requisitionToConvert = {
            requisitionId: requisition.id,
            supplyingDepotId: requisition.supplyingFacility
        };

    beforeEach(module('openlmis.requisitions'));

    beforeEach(module(function($provide){
        var requisitionFactorySpy = jasmine.createSpy('RequisitionFactory').andReturn(requisition),
            confirmSpy = jasmine.createSpy('Confirm').andCallFake(function(argumentObject) {
                return q.when(true);
            });

    	$provide.service('RequisitionFactory', function() {
            return requisitionFactorySpy;
        });

        $provide.service('Confirm', function() {
            return confirmSpy;
        });
    }));

    beforeEach(
        inject(
            function(_$httpBackend_, _$rootScope_, RequisitionService, RequisitionURL, OpenlmisURL,
                     Status, RequisitionFactory, DateUtils, $q, $templateCache, _RequisitionStorage_) {

                httpBackend = _$httpBackend_;
                $rootScope = _$rootScope_;
                requisitionService = RequisitionService;
                allStatuses = Status.$toList();
                requisitionFactory = RequisitionFactory;
                dateUtils = DateUtils;
                q = $q;
                requisitionUrl = RequisitionURL;
                openlmisUrl = OpenlmisURL;
                RequisitionStorage = _RequisitionStorage_;

                $templateCache.put('common/notification-modal.html', "something")
            }
        )
    );

    it('should get requisition by id', function() {
        var getRequisitionUrl = '/api/requisitions/' + requisition.id;
        var getTemplateUrl = '/api/requisitionTemplates/search?program=' + requisition.program.id;
        var getProductsUrl = '/api/facilities/' + requisition.facility.id +
                             '/approvedProducts?fullSupply=false&programId=' +
                             requisition.program.id;

        httpBackend.when('GET', requisitionUrl(getRequisitionUrl)).respond(200, requisition);
        httpBackend.when('GET', requisitionUrl(getTemplateUrl)).respond(200, {});
        httpBackend.when('GET', openlmisUrl(getProductsUrl)).respond(200, []);

        var data;
        requisitionService.get('1').then(function(response) {
            data = response;
        });

        httpBackend.flush();
        $rootScope.$apply();

        expect(data.id).toBe(requisition.id);

    });

    it('should initiate requisition', function() {
        var data;

        httpBackend.when('POST', requisitionUrl('/api/requisitions/initiate?emergency=' + emergency +
            '&facility=' + facility.id + '&program=' + program.id + '&suggestedPeriod=' + period.id))
        .respond(200, requisition);

        requisitionService.initiate(facility.id, program.id, period.id, emergency).then(function(response) {
            data = response;
        });

        httpBackend.flush();
        $rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson(requisition));
    });

    it('should get requisitions for convert', function() {
        var data,
            requisitionCopy = formatDatesInRequisition(angular.copy(requisitionDto)),
            params = {
                filterBy: 'filterBy',
                filterValue: 'filterValue',
                sortBy: 'sortBy',
                descending: 'true'
            };

        httpBackend.when('GET', requisitionUrl('/api/requisitions/requisitionsForConvert?descending=' + params.descending +
            '&filterBy=' + params.filterBy + '&filterValue=' + params.filterValue + '&sortBy=' + params.sortBy))
        .respond(200, [{requisition: requisitionDto}]);

        requisitionService.forConvert(params).then(function(response) {
            data = response;
        });

        httpBackend.flush();
        $rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson([{requisition: requisitionCopy}]));
    });

    it('should convert requisitions', function() {
        var callback = jasmine.createSpy();

        httpBackend.when('POST', requisitionUrl('/api/requisitions/convertToOrder'))
        .respond(function(method, url, data){
          if(!angular.equals(data, angular.toJson([requisitionToConvert]))){
            return [404];
          } else {
            return [200, angular.toJson(requisition)];
          }
        });

        requisitionService.convertToOrder([{requisition: requisition}]).then(callback);

        $rootScope.$apply();
        httpBackend.flush();
        $rootScope.$apply();

        expect(callback).toHaveBeenCalled();
    });

    it('should search requisitions with all params', function() {
        var data,
            statuses = [allStatuses[0].label, allStatuses[1].label],
            requisitionCopy = formatDatesInRequisition(angular.copy(requisitionDto))
            emergency = true;

        httpBackend.when('GET', requisitionUrl('/api/requisitions/search?createdDateFrom=' + startDate1.toISOString() +
            '&createdDateTo=' + endDate1.toISOString() + '&emergency=' + emergency +
            '&facility=' + facility.id + '&program=' + program.id +
            '&requisitionStatus=' + allStatuses[0].label + '&requisitionStatus=' + allStatuses[1].label))
        .respond(200, [requisitionDto]);

        requisitionService.search(false, program.id, facility.id, startDate1.toISOString(),
            endDate1.toISOString(), statuses, emergency).then(function(response) {
            data = response;
        });

        httpBackend.flush();
        $rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson([requisitionCopy]));
    });

    it('should search requisitions only with facility paramter', function() {
        var data,
            requisitionCopy = formatDatesInRequisition(angular.copy(requisitionDto2));

        httpBackend.when('GET', requisitionUrl('/api/requisitions/search?facility=' + facility.id))
        .respond(200, [requisitionDto2]);

        requisitionService.search(false, null, facility.id, null, null, null).then(function(response) {
            data = response;
        });

        httpBackend.flush();
        $rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson([requisitionCopy]));
    });

    it('should search requisitions offline', function() {
        var data;

        spyOn(RequisitionStorage, 'search').andReturn([requisitionDto2]);

        requisitionService.search(true, null, facility.id, null, null, null).then(function(response) {
            data = response;
        });

        $rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson([requisitionDto2]));
    });

    function formatDatesInRequisition(requisition) {
        requisition.processingPeriod.processingSchedule.modifiedDate = dateUtils.toDate(requisition.processingPeriod.processingSchedule.modifiedDate);
        requisition.processingPeriod.endDate = dateUtils.toDate(requisition.processingPeriod.endDate);
        requisition.processingPeriod.startDate = dateUtils.toDate(requisition.processingPeriod.startDate);
        requisition.createdDate = dateUtils.toDate(requisition.createdDate);
        return requisition;
    }

});
