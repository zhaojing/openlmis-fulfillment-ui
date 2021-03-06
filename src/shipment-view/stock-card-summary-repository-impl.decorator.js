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

    /**
     * @ngdoc service
     * @name shipment-view.StockCardSummaryRepositoryImpl
     *
     * @description
     * Extends stock card summary repository implementation with the ability to query for them with
     * the stock cards.
     */
    angular
        .module('shipment-view')
        .config(function($provide) {
            $provide.decorator('StockCardSummaryRepositoryImpl', decorator);
        });

    decorator.$inject = ['$delegate', 'StockCardResource'];

    function decorator($delegate, StockCardResource) {
        var StockCardSummaryRepositoryImpl = $delegate;

        StockCardSummaryRepositoryImpl.prototype.queryWithStockCards = queryWithStockCards;

        return StockCardSummaryRepositoryImpl;

        /**
         * @ngdoc method
         * @methodOf shipment-view.StockCardSummaryRepositoryImpl
         * @name queryWithStockCards
         *
         * @description
         * Queries OpenLMIS server and fetches a list of matching stock card summaries extended with
         * the stock cards
         *
         * @param {Object} params the search parameters
         */
        function queryWithStockCards(params) {
            return this.query(params)
                .then(function(page) {
                    var stockCardIds = new Set();
                    page.content.forEach(function(summary) {
                        summary.canFulfillForMe.forEach(function(canFulfillForMe) {
                            stockCardIds.add(canFulfillForMe.stockCard.id);
                        });
                    });

                    return new StockCardResource().query({
                        id: Array.from(stockCardIds)
                    })
                        .then(function(response) {
                            var stockCardsMap = response.content.reduce(function(stockCardsMap, stockCard) {
                                stockCardsMap[stockCard.id] = stockCard;
                                return stockCardsMap;
                            }, {});

                            page.content.forEach(function(summary) {
                                summary.canFulfillForMe.forEach(function(canFulfillForMe) {
                                    canFulfillForMe.stockCard = stockCardsMap[canFulfillForMe.stockCard.id];
                                });
                            });

                            return page;
                        });
                });
        }
    }

})();