/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe('RequisitionTemplate', function() {

    var rootScope, httpBackend, templateFactory, requisitionURL, template1, template2;

    beforeEach(module('openlmis.administration'));
    beforeEach(module('openlmis.requisitions'));

    beforeEach(inject(function($httpBackend, $rootScope, RequisitionTemplate, RequisitionURL) {
        httpBackend = $httpBackend;
        rootScope = $rootScope;
        templateFactory = RequisitionTemplate;
        requisitionURL = RequisitionURL;

        template1 = {
            id: '1',
            programId: '1'
        };
        template2 = {
            id: '2',
            programId: '2'
        };
    }));

    it('should get requisition template by id', function() {
        var data;

        httpBackend.when('GET', requisitionURL('/api/requisitionTemplates/' + template1.id))
        .respond(200, template1);

        templateFactory.get(template1.id).then(function(response) {
            data = response;
        });

        httpBackend.flush();
        rootScope.$apply();

        expect(data.id).toEqual(template1.id);
        expect(data.programId).toEqual(template1.programId);
    });

    it('should get all requisition templates', function() {
        var data;

        httpBackend.when('GET', requisitionURL('/api/requisitionTemplates'))
        .respond(200, [template1, template2]);

        templateFactory.getAll().then(function(response) {
            data = response;
        });

        httpBackend.flush();
        rootScope.$apply();

        expect(data[0].id).toEqual(template1.id);
        expect(data[0].programId).toEqual(template1.programId);
        expect(data[1].id).toEqual(template2.id);
        expect(data[1].programId).toEqual(template2.programId);
    });

    it('should search requisition template by program id', function() {
        var data;

        httpBackend.when('GET', requisitionURL('/api/requisitionTemplates/search?program=' + template2.programId))
        .respond(200, template2);

        templateFactory.search(template2.programId).then(function(response) {
            data = response;
        });

        httpBackend.flush();
        rootScope.$apply();

        expect(data.id).toEqual(template2.id);
        expect(data.programId).toEqual(template2.programId);
    });
});