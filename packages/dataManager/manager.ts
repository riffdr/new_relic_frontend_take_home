import allApps from '../dataProvider';
import { App, AppName, ApDex, AppList, Host, HostList, HostName } from './types';
import { alphaNumericComparator } from "./helper";

/**
 * Data Manager, retrieves and manages all the App and Host data.
 * DataManager.appProxy is a JS Proxy to manage the getter, setter and delete actions provided by allApps.
 * DataManager.appProxy acts as reference to DataManager.hostList, and stays as the 'source of truth' for retrieving the App Details (Dex score, hostList, contributors, version)
 * DataManager.hostList is an Object of type 'NameOfHost' : Array<AppNames> confectioned by the DataManager
 */

export default class DataManager {

  private maxNoAppInHost = 25;
  public appProxy:any;
  public hostList:HostList;

  constructor() {
    this.appProxy = new Proxy(allApps, this.appListHandler);
    this.hostList = this.setUpHostAppList();
  }

  /**
   * Provides access to the getting, setting and deleting apps from contents of the App
   */
  appListHandler: ProxyHandler<any> = {
    get(appList: AppList, property: string | Symbol) {
      // For accessing the proxy by looking at the app that matches the '.name' property key.
      for (let i = 0; i < appList.length; i++) {
        if (appList[i].name === property) {
          return appList[i];
        }
      }
    },

    set(appList: AppList, appName:AppName, app:App) {
      appList.push(app);
      return true;
    },
    // Remove every hosts assigned to that App.
    // My understanding of the requirements was an App had be removed from every assigned hosts, not removing the app itself.
    deleteProperty(appList:AppList, appName:AppName) {
      for(let i = 0; i < appList.length; i++) {
        if (appList[i].name == appName) {
          appList[i].host = [];
          return true;
        }
      }
      return false;
    },
  };

  /**
   * Will update this.hostList and this.appProxy, returns updated hostList
   * @param appName
   * @returns HostList
   */
  removeAppFromHosts = (appName:AppName):HostList => {
    const hostNameList = Object.keys(this.hostList);
    // Removing App from this.hostList[].app instead of generating a new list from Scratch. As usual, I choose performance at the expense of verbosity
    for(let i= 0; i < hostNameList.length; i++) {
      const hostName = hostNameList[i];
      const indexOf = this.hostList[hostName].indexOf(appName);
      if (indexOf !== -1) {
        this.hostList[hostName].splice(indexOf, 1);
      }
    }

    delete this.appProxy[appName];
    return this.hostList;
  };

  /**
   * Helper for sorting the apps by their apdex score.
   * @param appA
   * @param appB
   */
  sortAppByApDex = (appA:AppName, appB:AppName) : number => {
    return this.appProxy[appB].apdex - this.appProxy[appA].apdex;
  };

  /**
   * Sorting by the top apDex value
   * @param list
   * @param appName
   */
  addApptoSingleHost = (list:Host, appName:AppName, apDex: ApDex) => {
    // Adds only if new appName has a greater or equal score than the last one,
    // then apps it to list, and sorts it,
    // then removes 26th entry, which at this point has the lowest apdex score
    if (list.length === this.maxNoAppInHost && this.appProxy[list[list.length - 1]].apdex <= apDex) {
      list.push(appName);
      // Reserving the usage of sorting to this scenario, by default getTopAppsByHost() will take of this.
      // Sorting necessary to ensure no higher scoring app is left out of the list.
      // I tried skipping this sorting step, but appList for each host was greater the 3000, and it was impairing the rendering of the view.
      // This way we will never add more than this.maxNoAppInHost (25) apps per host
      list.sort(this.sortAppByApDex);
      list.pop();
      return list;
    }

    if (list.length < this.maxNoAppInHost ) {
      list.push(appName);
      return list;
    }
  };

  /**
   * Checks whether the appProxy list does container this App, adds to it if not.
   * Just using the setter from the app proxy
   * @param app
   */
  updateAppList = (app:any) => {
    if (!this.appProxy[app.name]) {
      console.log('New app was added: ',app.name )
      this.appProxy[app.name] = app;
    } else {
      this.appProxy[app.name].host = app.host;
    }
  };

  /**
   * Adds an app to the hostList and returns an updates both the hostList and the appProxy List
   * @param app
   */

  addAppToHosts = (app:App):HostList => {
    this.updateAppList(app);
    this.parseHostList(this.hostList, app);
    return this.hostList;
  };

  /**
   * Parses hostList and returns an updated  hostList
   * @param hostList
   * @param app
   */
  parseHostList = (hostList:HostList, app:App):HostList => {

    for (let z = 0; z < app.host.length; z++) {
      const hostName = app.host[z];
      const appName = app.name;
      const apDex = app.apdex;

      // Creating entry for new hostName
      if (!hostList[hostName]) {
        hostList[hostName] = [];
        hostList[hostName].push(appName);

      // Do not add app if already within list
      } else if (hostList[hostName].indexOf(appName) === -1 ) {
        this.addApptoSingleHost(hostList[hostName], appName, apDex);
      }

    }
    return hostList;
  };

  /**
   * Stateful function to return hostList using the appProxy
   */
  setUpHostAppList = (): HostList => {
    let hostList: any = {};
    for (let i = 0; i < allApps.length; i++) {
      this.parseHostList(hostList, allApps[i]);
    }
    return hostList;
  }

  /**
   * Including this function a per instructions of the take home assignment.
   * @param hostName
   */
  getTopAppsByHost = (hostName:HostName):Host => {
    if (this.hostList[hostName].length < this.maxNoAppInHost) {
      return this.hostList[hostName].sort(this.sortAppByApDex);
    } else {
      return this.hostList[hostName]
    }

  }

  /**
   * I inferred from the screenshots that the hosts were to be ordered alphanumerically.
   * Lets an arrayList with all the HostNames ordered alphaNumerically.
   */
  getHostNames = (): Array<HostName> => {
    return Object.keys(this.hostList).sort(alphaNumericComparator);
  }

}
