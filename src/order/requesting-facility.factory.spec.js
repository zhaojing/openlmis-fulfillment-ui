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

describe('requestingFacilityFactory', function() {

    var $q, requestingFacilityFactory, facilityService, requestingFacilities, minimalFacilities, $rootScope;

    beforeEach(function() {
        module('order');
        module('referencedata-requesting-facility');

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            requestingFacilityFactory = $injector.get('requestingFacilityFactory');
            facilityService = $injector.get('facilityService');
        });

        requestingFacilities = ['1', '2'];

        minimalFacilities = [
            {
                id: '1',
                name: 'First factory'
            },
            {
                id: '2',
                name: 'Second factory'
            },
            {
                id: '3',
                name: 'Third factory'
            }
        ];

        spyOn(facilityService, 'getAllMinimal').andReturn($q.when(minimalFacilities));
    });

    describe('getRequestingFacilities', function() {
        it('should return promise', function() {
            spyOn(facilityService, 'getRequestingFacilities').andReturn($q.when(requestingFacilities));

            var result = requestingFacilityFactory.loadRequestingFacilities();
            expect(angular.isFunction(result.then)).toBe(true);
        });

        it('should call facilityService', function() {
            spyOn(facilityService, 'getRequestingFacilities').andReturn($q.when(requestingFacilities));

            requestingFacilityFactory.loadRequestingFacilities();
            expect(facilityService.getAllMinimal).toHaveBeenCalled();
            expect(facilityService.getRequestingFacilities).toHaveBeenCalled();
        });

        it('should return available minimal facilities', function() {
            spyOn(facilityService, 'getRequestingFacilities').andReturn($q.when(requestingFacilities));

            var result;
            requestingFacilityFactory.loadRequestingFacilities().then(function(facilities) {
                result = facilities;
            });

            $rootScope.$apply();

            expect(result).toEqual([minimalFacilities[0], minimalFacilities[1]]);
        });

        it('should preserve the order of minimal facilities', function() {
            // requesting facilities in reverse order
            requestingFacilities = ['3', '2', '1'];
            spyOn(facilityService, 'getRequestingFacilities').andReturn($q.when(requestingFacilities));

            var result;
            requestingFacilityFactory.loadRequestingFacilities().then(function(facilities) {
                result = facilities;
            });

            $rootScope.$apply();

            expect(result).toEqual([minimalFacilities[0],
                minimalFacilities[1], minimalFacilities[2]]);
        });
    });

});
