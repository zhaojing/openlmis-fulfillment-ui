5.0.2 / WIP
==================

Bug fixes

* [OLMIS-2567](https://openlmis.atlassian.net/browse/OLMIS-2567): Incorperated openlmis-facility-program-select.
* [OLMIS-2532](https://openlmis.atlassian.net/browse/OLMIS-2532): Fixed manage PODs view always displayed the previously facility.

5.0.1 / 2017-05-26
==================

Bug fixes

* [OLMIS-2445](https://openlmis.atlassian.net/browse/OLMIS-2445): Button and title capitalization are consistent.
* [OLMIS-2488](https://openlmis.atlassian.net/browse/OLMIS-2488): Fixed proof of Delivery screen action button text was not translated.
* View Orders screen will now only require either ORDERS_VIER or PODS_MANAGE right to enter(https://github.com/OpenLMIS/openlmis-fulfillment-ui/pull/1).

5.0.0 / 2017-05-08
==================

Compatibility breaking changes:
* [OLMIS-2107](https://openlmis.atlassian.net/browse/OLMIS-2107): Add breadcrumbs to top of page navigation
  * All states have been modified to be descendants of the main state.

Bug fixes and performance improvements which are backwards-compatible:

* [OLMIS-2355](https://openlmis.atlassian.net/browse/OLMIS-2355): Inncorect working sticky columns - large gap in tables
* [OLMIS-2204](https://openlmis.atlassian.net/browse/OLMIS-2204): The administration menu item should always be the last menu item
  * Priority of all fulfillment screens have been changed to 0.

Dev and tooling updates made in a backwards-compatible manner:

* [OLMIS-1853](https://openlmis.atlassian.net/browse/OLMIS-1853): Separate push and pull Transifex tasks in build
  * Migrated to dev-ui 3.
* [OLMIS-1609](https://openlmis.atlassian.net/browse/OLMIS-1609): UI i18N message strings are not standardized
* [OLMIS-2204](https://openlmis.atlassian.net/browse/OLMIS-2204): The administration menu item should always be the last menu item
