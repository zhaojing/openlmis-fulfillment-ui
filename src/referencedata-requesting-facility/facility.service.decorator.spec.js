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

describe('Facility service decorator', function() {
    var facilityService, $rootScope, $httpBackend, fulfillmentUrlFactory;

    beforeEach(function() {
        module('referencedata-requesting-facility');

        inject(function($injector){
            $rootScope = $injector.get('$rootScope');
            $httpBackend = $injector.get('$httpBackend');
            facilityService = $injector.get('facilityService');
            fulfillmentUrlFactory = $injector.get('fulfillmentUrlFactory');
        });

        facilities = ['facility-1', 'facility-2'];

        $httpBackend.when('GET', fulfillmentUrlFactory('/api/orders/requestingFacilities'))
            .respond(200, facilities);
    });

    it('getRequestingFacilities should return available requesting facilities', function() {
        var requestingFacilities;

        facilityService.getRequestingFacilities().then(function(response){
            requestingFacilities = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(requestingFacilities.length).toBe(2);
        expect(requestingFacilities[0]).toEqual(facilities[0]);
        expect(requestingFacilities[1]).toEqual(facilities[1]);
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});