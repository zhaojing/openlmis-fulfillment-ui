5.1.1 / WIP
==================

New functionality added in a backwards-compatible manner:
* [OLMIS-3607](https://openlmis.atlassian.net/browse/OLMIS-3607): Added created date and last updated columns to the Order list view

5.1.0 / 2017-11-09
==================

New functionality added in a backwards-compatible manner:
* [OLMIS-3222](https://openlmis.atlassian.net/browse/OLMIS-3222): Added period start and end dates parameters to the order view screen

Bug fixes:
* [OLMIS-3159](https://openlmis.atlassian.net/browse/OLMIS-3159): Fixed facility select loosing state no POD manage page.
* [OLMIS-3285](https://openlmis.atlassian.net/browse/OLMIS-3285): Fixed broken pagination on Manage Proofs of Delivery page.
* [OLMIS-3540](https://openlmis.atlassian.net/browse/OLMIS-3540): Now Manage POD displays items with IN_ROUTE status.

Improvements:
* Updated dev-ui version to 6.
* [OLMIS-3448](https://openlmis.atlassian.net/browse/OLMIS-3448): Preserve the order of facilities in the dropdown on Order View.

5.0.3 / 2017-09-01
==================

Bug fixes

* [OLMIS-2837](https://openlmis.atlassian.net/browse/OLMIS-2837): Fixed filtering on the manage POD page.
* [OLMIS-2724](https://openlmis.atlassian.net/browse/OLMIS-2724): Fixed broken requesting facility filter select on Order View.

5.0.2 / 2017-06-22
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
