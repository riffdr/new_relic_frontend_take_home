# New Relic Assignment - Miguel Ángel Zárate Casanova

## Table of contents
* [About](#1-about)
* [Installation](#2-installation)
* [Project breakdown](#3-project-breakdown)
* [How to run it](#4-how-to-run-it)
* [Unit Testing](#5-unit-testing)
* [Big O Notation](#6-big-o-notation)
* [Data rendering](#7-data-rendering)
* [Tech stack](#8-tech-stack)
* [Future lines of development](#9-future-lines-of-development)

## 1. About
This is the take home assigment for Miguel Zarate in compliance with the recruitment process for the position of Senior FE Developer at New Relic.

## 2. Installation
1. You must have `Node version 18` installed or, if you have Homebrew, you can run the following on the terminal:
```
brew install node@18
```
2. You must have `yarn` as your choice of package manager to run the commands of the repo. Once you complete the step above, you can install yarn using Homebrew or npm:
```
brew install yarn
```
or
```
npm install yarn -g
```
3. Use yarn to install all dependencies for the project. In a terminal, run from the root of the project:
```
yarn install
```

### 2.1 Upgrading from lower node versions
If you already have a lower node version of node installed, you will want to install the `n` tool which lets you switch node
versions [https://www.npmjs.com/package/n](https://www.npmjs.com/package/n).

To determine you current node version, run `node -v`. This will give you the exact version, what you are
interested in is the first number.

Install the `n` tool by running the command `npm install -g n`.

Once `n` is installed, you can use it to install, and switch between, versions of node.

Install node 18 by running `sudo n 18`. If you have not already installed node 18,
node 18 will be installed. Otherwise, you will be switched to using node 18.

Once again, you can verify your current node version with `node -v`.

If you want to switch back to another version of node, say it 12, then run `sudo n 12`.

## 3. Project breakdown

### 3.1 Repository layout
* I have organized the repo as a multi-package repository using yarn workspaces.
* Main`./index.html` -> declares the html of the application document, except for the App and Host data rendered by the [hostContainer](packages/components/hostContainer/package.json)
* Folder `/packages` contains:
  * `/components` -> Customer facing component, including the customer facing component [hostContainer](packages/components/hostContainer/package.json) and abstract [Component](packages/components/component/package.json) that provides stateful data state management
  * `/dataManager` ->  Data Manager, retrieves and manages all the App and Host data
  * `/dataProvider` ->  Serves all the AppHost Data as a JS module. Not included in the component bundle and managed through an import map (check index.html to see its implementation)
* Folder `/tools` ->
  * `/tools/bundler` -> Using [esbuild](https://esbuild.github.io/faq/), written in Go, exceedingly faster than webkpac or rollup which are written in JavaScript.
  * `/tools/local-server` -> Using [esbuild](https://esbuild.github.io/faq/), written in Go, exceedingly faster than webkpac or rollup which are written in JavaScript.
* Folder `./dist` -> every compiled asset to be used from `./index.html`.
* Folder `./stylesheets` -> contains the `.scss` files that are compiled by dart sass.
  * `./stylesheet/utils`-> sass functions & helpers.

### 3.2 Yarn Workspaces

* I am using workspaces to avoid the usage of symlinks and avoiding using aliases, and avoiding declaring all dependencies in `package.json`at root.
* Workspaces allow for a better code structure, separating modules per usage.

### 3.3 Stylesheets: Atomic Web Design
* I have broken down the UI following the pattern [Atomic Web Design ](https://bradfrost.com/blog/post/extending-atomic-design/), a.k.a 'AWD'
* The stylesheet folders reflect this design.
* The 'core logic' of the UI component lives at its core .scss, any customizations (custom margins, widths, arrangement) must be placed and orchestrated from a higher hierarchy by another UI component with a.
* Dimensions are harnessed by a 5px base unit, available at the [document root](stylesheets/tokens/_baseUnit.scss) and controller by a [baseUnitFactor helper](stylesheets/utils/_baseUnitFactor.scss).
* Compiled with dart sass, avoiding the much slower Ruby Sass.
* Naming convention:
  * I have followed none, although I have used BEM and Stylus.
  * I have favored specificity and simplicity.
  * Ideally the markup, and css should live (except for the main html containers header, main, footer) within Custom Elements within ShadowDom which provides style encapsulation are requires zero specificity.

### 3.4 Data serving
* Served as a JS Module by the [data provider](packages/dataProvider/package.json)
### 3.5 Data management
* Served as a JS Module by the [data manager](packages/dataManager/package.json)
### 3.6 Components
* The App and Host content is  as a JS Module by the [data manager](packages/dataManager/package.json)
### 3.7 Typescript
* Typescript was employed in the  `/components` directory for creating the components.
* For simpler tools, such as the bundler and the local server (themselves being just configuration files), vanilla JS was used:

## 4. How to run it
* After completing all the stages in step 1. [Installation](#2-installation), you should have run this command:
```
yarn install
```
* After this, you're ready to launch the app, just do the following to bundling the app and run a local server with express:
```
yarn start
```
* A window will open for http://localhost:3000, you should by now be able to see the requested grid view with the Hosts and their assigned apps.

### 4.1. Testing 'addAppToHosts' and 'removeAppFromHosts' methods:
* Uncomment line 14 from component HostContainer with method (testNonUIVisibleActions)[packages/components/hostContainer/index.ts] to trigger both methods.
* Run command:
```
yarn build
```
* After this, refresh the page. Separate timeOuts will trigger `addAppToHosts` (with a new App) after 1.5 seconds and then `removeAppFromHosts` after 3 seconds to delete an existing App.
* After each method is invoked, the state of HostContainer will be updated and thus its method render() will be invoked.

## 5. Unit Testing
* I have written unit tests for the components, except for hostContainer as most of its methods were returning html strings and I am inclined to test this at integration or functional testing, not unit testing.
* I have mocked data but eventually, I would loved to use a factory patter to generate it against the typescript types of tested module.
* Used [Ts Jest](https://kulshekhar.github.io/ts-jest/).
* To run the tests, simply:
```
yarn test:unit
```

## 6. Big O Notation
* I am aware that the search algorithm in [dataManager](packages/dataManager/manager.ts) with its inner loops introduces a Quadratic time complexity, Big O(n^2). This seemed unavoidable at least at load time when retrieving the list of hosts for every app.
* To improve the performance of the search algorithm, I have attempted to have as many methods as possible to parse and retrieve the info in a stateless way and thus avoiding checking the large allApps proxy thus triggering yet another for-loop, at least at page load time when the method setUpHostAppList() returns a list with all the hosts.
  * That is the motivation behind having DataManager.hostList, to ensure as much as possible acessing the large
  * The exception here is obviously the method `addApptoSingleHost`
  * In defense of my solution, I have worked with separate objects in order to avoid probing the original one as much as possible.
    allApps object within DataManager.appProxy
  * For-loops have been used as they perform better in iterating large objects than .map .forEach .reduce, etcetera.

## 7. Data rendering
* In `/components`  I have included an abstract [Component](packages/components/component/package.json) that provides stateful data state management
* Components such (e.g  'HostContainer') must implement this Abstract Class and implement a render method.
* Whenever the instances of the abstract implementation have they data state updated via method 'setState', their implemented method render() will get triggered.

## 8. Tech stack
- Yarn
- Typescript
- Jest (ts-jest)
- Esbuild
- Dart Sass
- Import Maps

## 9. Future lines of development
* Extending the DataManager or breaking it down into two classes. I wanted to have had more time to investigate how to avoid the for-loop nesting and use two separate loops instead
* Web Components to provide style and component re-usability.
* I would have liked to implement Cypress.io or Playwright and write a couple of integration or functional testing.
* More UI Tests written.
* Linters (eslint, stylelint).
* I was ordered to submit this as a zip file and not as a repo, so obviously in future development I would have some versioning guardrails such as dependency version checker. 
