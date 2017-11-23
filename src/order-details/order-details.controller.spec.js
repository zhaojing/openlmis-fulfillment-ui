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

describe('orderDetailsController', function() {

    var vm, $controller, order;

    beforeEach(function() {
        module('order-details');

        inject(function($injector) {
            $controller = $injector.get('$controller');
        });

        order = {
            "id" : "ec49baf1-fb6c-4bbc-ad5e-54fff70115a2",
            "emergency" : false,
            "createdDate" : new Date(2017, 11, 10),
            "program" : {
                "id" : "10845cb9-d365-4aaa-badd-b4fa39c6a26a",
                "code" : "PRG002",
                "name" : "Essential Meds",
                "description" : null,
                "active" : true,
                "periodsSkippable" : false,
                "showNonFullSupplyTab" : null
            },
            "requestingFacility" : {
                "id" : "13037147-1769-4735-90a7-b9b310d128b8",
                "code" : "DH01",
                "name" : "Balaka District Hospital",
                "type" : {
                    "id" : "663b1d34-cc17-4d60-9619-e553e45aa441",
                    "code" : "dist_hosp",
                    "name" : "District Hospital",
                    "description" : null,
                    "displayOrder" : 3,
                    "active" : true
                }
            },
            "orderCode" : "ORDER-00000000-0000-0000-0000-000000000009R",
            "status" : "IN_ROUTE",
            "orderLineItems": [
                {
                    "orderedQuantity": 10,
                    "filledQuantity": 10,
                    "orderable": {
                        "productCode": "C1",
                        "fullProductName": "Acetylsalicylic Acid"
                    }

                }
            ]
        };

        vm = $controller('OrderDetailsController', {
            order: order
        });

    });

    describe('onInit', function() {

        it('should expose order', function() {
            vm.$onInit();
            expect(vm.order).toEqual(order);
        });

    });

});
