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