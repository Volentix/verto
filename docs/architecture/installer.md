# Verto Installer

The following has the documentation for the Verto installer pattern. this will be used to update Verto as well as, potentially, install additional plugins.

## Notes

This feature relies on the outcome of the [webview go nogo decision](webview.md).

In the event the decision is to migrate to  Webview we will need to create our own autoupdater that can install and update apps with the secure key provided by Volentix. If the app cannot be signed we will not be able to migrate to Webview until such time that all application functionality is refactored to be a plugin.

If electron is selected, we will need to review the current mechnics of updating the app and improve the experience.