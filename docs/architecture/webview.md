# Webview Vrs Electron

  * [Intro](#intro)
  * [What Is Webview](#what-is-webview)
  * [Size Matters](#size-matters)
  * [What Do We Gain](#what-do-we-gain)
  * [What Do We Give Up](#what-do-we-give-up)
  * [Where Is The Line](#where-is-the-line)
  * [And The Others](#and-the-others)

## Intro

The current version of Verto runs on [Electron](https://electronjs.org/) for desktop applications. While this has been the industry trend, we have also seen some cracks emerge. As a result, a new pattern of using [Webview](https://github.com/zserge/webview).

## What Is Webview

Webview is a layer lower down than the Electron Chromium. It is more native and will give us much more control on the features and security we can integrate into the application. The issues with webview is that many of the features found in Electron will need to be rebuilt ontop of webview. 

Think of Webview as a lower-level and just about presenting application user interfaces in browser-based windows. Webview also supports C and C++ in addition to Golang and also exposes bindings for other languages like Rust and Haskell. This library supports not only Chrome/Chromium but also working on Windows' MSHTML and other WebKit coverage. 

## Size Matters

The more code you write and ship with the more likely you are to have issues later on with regards to consiquences you had not intended. With this in mind, the size of the respective platforms are, approx:

1. **Electron:** 50Mb
2. **Webview:** 5Mb

## What Do We Gain

Besides a smaller code base, and a friendlier user experience, especially at the edge of the network, going towards webview provides us with a lot more security. Because we will need to write the wrapper to webview, we will also be able to control the sandboxing and intercommunication of applications. Something that Electron does not do easily. This is important for the additional features like the sovereign identity platform as well as third party plugins.

The long and the short of it is, we get better security that will protect our users and their investments.

## What Do We Give Up

Convinience. Webview requires us to write a wrapper to use it. This is great because we can limit the amount of functionality available, however, it comes at the cost of engineering.

Additionally, as has been mentioned in other places, Webview also requires autoupdaters to be written since that function, native to Electron, does not exist on this platform.

## Where Is The Line

We will need to decide who is responsible for what aspects from a logical perspective. For example, it makes sense that Quasar has a build plugin, native to Quasar, that others, outside of Verto may reuse.

## And The Others

Other platforms to consider:

- [NW.js](https://github.com/nwjs/nw.js)
