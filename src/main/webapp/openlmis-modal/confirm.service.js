(function() {

    'use strict';

    /**
     *
     * @ngdoc service
     * @name openlmis-modal.confirmService
     * @description
     * Service allows to display confirm modal with custom message.
     *
     */

    angular.module('openlmis-modal')
        .service('confirmService', confirmService);

    confirmService.$inject = ['bootbox', 'messageService', '$q'];

    function confirmService(bootbox, messageService, $q) {

        this.confirm = confirm;
        this.confirmDestroy = destroy;

        /**
         *
         * @ngdoc function
         * @name confirm
         * @methodOf openlmis-modal.confirmService
         * @param {String} message Primary message to display at the top
         * @param {Function} additionalMessage Additional message to display below
         * @param {String} buttonMessage Optional message to display on confirm button
         *
         * @description
         * Shows confirm modal with custom message.
         *
         */
        function confirm(message, buttonMessage) {
            return makeModal(false, message, buttonMessage);
        }

        /**
         *
         * @ngdoc function
         * @name destroy
         * @methodOf openlmis-modal.confirmService
         * @param {String} message Message to display
         * @param {String} buttonMessage Optional message to display on confirm button
         * @return {Promise} confirm promise
         *
         * @description
         * Shows confirm modal with custom message and returns a promise.
         *
         */
        function destroy(message, buttonMessage) {
            return makeModal(true, message, buttonMessage);
        }

        function makeModal(remove, message, buttonMessage) {
            var deferred = $q.defer();
            bootbox.dialog({
                message: messageService.get(message),
                buttons: {
                    cancel: {
                        label: messageService.get('msg.button.cancel'),
                        callback: deferred.reject
                    },
                    success: {
                        label: messageService.get(buttonMessage ? buttonMessage : 'msg.button.ok'),
                        callback: deferred.resolve,
                        className: remove ? "danger" : "primary"
                    }
                }
            });
            return deferred.promise;
        }
    }
})();
