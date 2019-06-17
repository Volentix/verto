# Verto Installer

 * [Why The Installer](#why-the-installer)
   + [Migrate To Webview](#migrate-to-webview)
   + [Plugin Management](#plugin-management)
 * [Go No / Go](#go-no--go)
 * [No Go](#no-go)
 * [Features](#features)
   + [Launch](#launch)
   + [Manage Plugins](#manage-plugins)

## Why The Installer

The following has the documentation for the Verto installer pattern. The reason for an installer is for the following reasons:

### Migrate To Webview

If the team makes the decision to migrate from Electron onto Webview then an update mechanic will be required as Webview does not have one available.

### Plugin Management

Current thoughts on the management of plugins would require a secure mechanic, outside of Verto, or at least core Verto, that handles the management and updates of user installed plugins.

## Go No / Go

This feature relies on the outcome of the [webview go nogo decision](webview.md).

## No Go

If the team decides not to migrate onto webview, we will still need to review the current auto-update practices in place. In short summary, the user workflow can be optomized and the overall experience has much needed room for improvement.

## Features

The downloader will require the following features in order to fulfill the use case.

### Launch

This is the Icon the user clicks on for their operating system, however, the launch, at least logically, can be considered as another application outside of Verto. In practice, this launcher may be a plugin from Quasar rather than something Volentix and Verto manage. In essence, others will require this functionality for their applications as well.

In short, the launcher will:

1. Check  to see if the Verto version is the latest version available. Currently this strategy has not been defined.
2. Update Verto for the user if a new version is found.

### Manage Plugins

The overall Verto architecture will have the capability to manage plugins for the user. The current thought, although not finalized, is to validate and load the plugins before Verto launches.

Note the plugin manager, at least for V1 will be restricted to the MVP for managing plugins. For the MVP, the team will pick one existing function found in Verto and write a plugin for that feature. As the V1 MVP will only have this feature, the plugin itself will be shipped with Verto inside the binary. Note that it will adhere to all the requirements of defined for the management of plugins. By following this strategy for the V1 release of Verto, the team can focus on the core mechanics of the architecture while staving off the more advanced features such as decentralized distribution as well as user facets like search, upgrade, and delete.

The MVP will:

1. Loading and validating of the plugins
2. Isolation of plugin (no visibility into the parent view object) functionality
3. Integration mechanics for the SI feature to 3rd party developers
4. Plugin + Verto availability mechanics. The process of having an app approved.

After the MVP, the application will need to support:

1. Decentralized distribution of plugins
2. Update notification services
3. Visual dashboard management of plugins
4. Decentralized marketplace mechanics
5. Automation on 3rd party functionality integration

