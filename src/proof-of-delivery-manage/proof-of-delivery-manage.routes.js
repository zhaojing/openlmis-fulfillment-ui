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

(function() {

    'use strict';

    angular
        .module('proof-of-delivery-manage')
        .config(routes);

    routes.$inject = ['$stateProvider', 'FULFILLMENT_RIGHTS', 'REQUISITION_RIGHTS'];

    function routes($stateProvider, FULFILLMENT_RIGHTS, REQUISITION_RIGHTS) {

        $stateProvider.state('openlmis.orders.podManage', {
			showInNavigation: true,
			label: 'proofOfDeliveryManage.managePods',
            url: '/manage?facility&program&supervised&page&size',
            controller: 'ProofOfDeliveryManageController',
            controllerAs: 'vm',
            templateUrl: 'proof-of-delivery-manage/proof-of-delivery-manage.html',
            accessRights: [
                REQUISITION_RIGHTS.REQUISITION_CREATE,
                FULFILLMENT_RIGHTS.PODS_MANAGE
            ],
            areAllRightsRequired: true,
            resolve: {
                pods: function(paginationService, orderFactory, $stateParams) {
					return paginationService.registerUrl($stateParams, function(stateParams) {
                        if(stateParams.program) {
                            var paramsCopy = angular.copy(stateParams);
                            paramsCopy.requestingFacility = stateParams.facility;
                            delete paramsCopy.facility;

                            return orderFactory.searchOrdersForManagePod(paramsCopy);
                        }
                        return undefined;
					});
				}
            }
        });
    }
})();
