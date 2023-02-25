import DataManager from './manager';

jest.mock('@miguelzarate/data-provider', () => {
  return [
    {
      'name': 'Films',
      'contributors': ['Peter Jackson', 'Stanley Kubrick'],
      'version': 1,
      'apdex': 100,
      'host': ['host1', 'host2', 'host3']
    },
    {
      'name': 'Music',
      'contributors': ['Grant Green', 'Lee Morgan', 'Wes Montgomery'],
      'version': 99999,
      'apdex': 99,
      'host': ['host1', 'host5', 'host6']
    },
    {
      'name': 'Games',
      'contributors': ['Ron Gilbert', 'Tim Schaffer', 'John Romero'],
      'version': 33,
      'apdex': 98,
      'host': ['host3', 'host2', 'host4']
    },
    {
      'name': 'Sports',
      'contributors': ['Rowing', 'Scuba diving', 'Diving'],
      'version': 444,
      'apdex': 94,
      'host': ['host4', 'host6', 'host5']
    }
  ];
});

afterEach(() => jest.clearAllMocks());

describe('DataManager unit tests i',() => {
  it('DataManager() creates assigns the right values to class and calls right methods',() => {
    const dataManager = new DataManager();
    expect(Object.keys(dataManager.hostList).length).toEqual( 6);
    expect(dataManager.hostList['host1']).toEqual( ['Films', 'Music']);
  });

  it('removeAppFromHosts() must update the hostList and proxy, ensure there are no hosts assigned to any app, and return a new hostList' , ()=> {
    const appName = 'Games'
    const dataManager = new DataManager();

    expect(dataManager.appProxy[appName].contributors).toEqual( ['Ron Gilbert', 'Tim Schaffer', 'John Romero']);
    expect(dataManager.appProxy[appName].host.length).toEqual( 3);
    expect(dataManager.hostList['host4'].includes(appName)).toBeTruthy();

    const newHostList = dataManager.removeAppFromHosts(appName);
    expect(dataManager.hostList['host4'].includes(appName)).toBeFalsy();
    expect(newHostList['host4'].includes(appName)).toBeFalsy();
    expect(dataManager.appProxy[appName]).toEqual( {'apdex': 98, 'contributors': ['Ron Gilbert', 'Tim Schaffer', 'John Romero'], 'host': [], 'name': 'Games', 'version': 33});
    expect(dataManager.appProxy[appName].host.length).toEqual( 0);
  });

  it('setUpHostAppList() returns a new hostList, invokes parseHostList() N times per number of Apps' , ()=> {
    const dataManager = new DataManager();
    const parseHostListSpy = jest.spyOn(dataManager, 'parseHostList');
    expect(parseHostListSpy).toHaveBeenCalledTimes(0);

    dataManager.setUpHostAppList();
    expect(parseHostListSpy).toHaveBeenCalledTimes(4);
  });

  it('getTopAppsByHost(hostName) returns dataManager.hostList[hostName]' , ()=> {
    const dataManager = new DataManager();
    expect(dataManager.getTopAppsByHost('host1')).toEqual(['Films', 'Music']);
    expect(dataManager.getTopAppsByHost('host6')).toEqual( ['Music', 'Sports']);
  });

  it('addApptoSingleHost(list, apdex, appname):Host (i),  adds app to a given host, should the host have no apps yet, returns a :Host ' , ()=> {
    const dataManagerObject = new DataManager();
    const list =  ['Music'];
    const newAppList = dataManagerObject.addApptoSingleHost(list, 'Films', 100);
    expect(newAppList).toEqual(['Music', 'Films']);
  });

  it('addApptoSingleHost(list, apdex, appname):Host (ii),  adds app to a given host, should the host have either less or more than 25 apps yet, orders app list given a the apdex score, returns a :Host' , ()=> {
    const dataManagerObject = new DataManager();
    const appList = ['Films', 'Music'];
    const newAppList = dataManagerObject.addApptoSingleHost(appList, 'Sports', 444);
    expect(newAppList).toEqual(['Films', 'Music',  'Sports']);

    // Would have liked to create a mock data factory to test more cases here, if so,
    // I would have gone using the existing types with a factory pattern using 'factory.ts'

  });
});

describe('DataManager unit tests ii',() => {

  it('addAppToHosts(app) must update the proxy and return a new hostList' , ()=> {
    const newApp = {
      'name': 'NewApp',
      'contributors': ['contributor1', 'contributor2'],
      'version': 10,
      'apdex': 1,
      'host': ['host3', 'host2', 'host1']
    };
    const dataManager = new DataManager();
    const updateAppListSpy = jest.spyOn(dataManager, 'updateAppList');

    expect(updateAppListSpy).toHaveBeenCalledTimes(0);
    expect(dataManager.hostList['host3'].includes(newApp.name)).toBeFalsy();
    expect(dataManager.appProxy[newApp.name]).toBe(undefined);

    const newHostList = dataManager.addAppToHosts(newApp);
    expect(updateAppListSpy).toHaveBeenCalledTimes(1);
    expect(updateAppListSpy).toBeCalledWith(newApp);
    expect(newHostList['host3'].includes(newApp.name)).toBeTruthy();
    expect(dataManager.appProxy[newApp.name].contributors).toEqual(['contributor1', 'contributor2']);
  });

});

// More coverage deliver if given more time...
