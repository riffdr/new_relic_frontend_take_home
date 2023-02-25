import { Component } from '../component';
import DataManager from '../../dataManager';
import type { App, AppName, ApDex, Host, HostName, Version } from '../../dataManager';

class HostContainer extends Component {
  private dataManager: DataManager;

  constructor(assignedElement: Element) {
    super(assignedElement);
      this.dataManager = new DataManager();
      this.state.hostList = this.dataManager.getHostNames();
      this.htmlElement.addEventListener('click', this.clickHandler, {capture: true});
      this.render();
      // Uncomment out this line to invoke both 'addAppToHosts' and 'removeAppFromHosts'.
      // this.testNonUIVisibleActions();
  };

  /**
   *  Use this to invoke 'addAppToHosts' and 'removeAppFromHosts'.
   */
  testNonUIVisibleActions = ():void => {
    setTimeout(() => {
      const newApp:App = {
        name: 'A new app',
          contributors: ['Mr White', 'Mr Pink', 'Jason Williams'],
        version: 66,
        apdex: 100,
        host: ['1d717554-bf17.sydnie.name', '7e6272f7-098e.dakota.biz', 'b0b655c5-928a.nadia.biz', '0000-0-newhost']
      };
      this.addAppToHosts(newApp);
    }, 1500);

    setTimeout(() => {
      this.removeAppFromHosts('Practical Metal Computer - Auer LLC, Inc');
    }, 3000);
  };

  clickHandler = (clickEvent:Event):void => {
    clickEvent.composedPath().map( (eventTarget: EventTarget) => {
      const htmlElement:HTMLElement = eventTarget as HTMLElement;
      if (htmlElement.dataset.version) {
        alert(`App version: ${htmlElement.dataset.version}` )
        return;
      }
    });
  };

  removeAppFromHosts = (appName:AppName) => {
    this.dataManager.removeAppFromHosts(appName);
    this.setState({
      hostList: this.dataManager.getHostNames()
    });
  };

  addAppToHosts = (newApp:App) => {
    this.dataManager.addAppToHosts(newApp);
    this.setState({
      hostList: this.dataManager.getHostNames()
    });
  };

  getAppListMarkup = (appName: AppName, apdex: ApDex, version: Version):string => {
    return `<div class="nr-app-info" data-version="${version}">
                <span>${apdex}</span>
                <h3>${appName}</h3>
            </div>`;
  };

  getHostCardMarkup = (appList: Host, hostName: HostName, maxNoApps = 5):string => {
    let appsContainerMarkup = '';
    maxNoApps = maxNoApps < appList.length ? maxNoApps : appList.length;

    for (let i = 0; i < maxNoApps; i++) {
      const appName = appList[i];
      appsContainerMarkup += this.getAppListMarkup(appName, this.dataManager.appProxy[appName].apdex, this.dataManager.appProxy[appName].version);
    }

    return `<div class="nr-host-card">
                <h2>${hostName}</h2>
                ${appsContainerMarkup}
            </div>`;
  };

  getMarkup = (hostList: Array<HostName>): string => {
    let newMarkup = '';

    for (let i = 0; i < hostList.length; i++) {
      const hostName = hostList[i];
      newMarkup += this.getHostCardMarkup(this.dataManager.getTopAppsByHost(hostName), hostName);
    }
    return newMarkup;
  };

  render():void {
    this.htmlElement.innerHTML = this.getMarkup(this.state.hostList);
  };
}


// Initializing the component
const htmlComponent = document.querySelector('.nr-host-container');
if (htmlComponent) {
  new HostContainer(htmlComponent);
}
