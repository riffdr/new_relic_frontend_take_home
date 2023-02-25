/**
 * Component abstract class requires an html element to assign it to and be capable of updating its contents when the stetState is invoked
 * To use is simple extend it to another class and ensure that the class features an abstract method and it is assigned an html element
 * Example new YourClassName(document.querySelector('yourElementSelector));
 * @param element
 * @protected
 *
 * Things that I would have loved to developer, if give the time
 *  - Work with HTML Elements, provide shadowDOM support
 *  - Work better the state management, support data interfaces in the implementation class objects
 *
 */
export abstract class Component {
  htmlElement: Element;
  // :any used because of the Proxy object type
  state: any;

  protected constructor(element:Element) {
    this.htmlElement = element;
    this.state = new Proxy({}, this.proxyHandler);
  }

  /**
   * Handler for the JS Proxy.
   * Provides the ability to setting and getting content of the state via the setState method using the state[key] = value pattern
   * @private
   */
  private proxyHandler: ProxyHandler<any> = {
    set: (state:any, key:string, value:any) => {
      state[key] = value;
      return true;
    }
  };

  /**
   * Updates the state and triggers the to-be-implemented method `render()` whenever the state updates.
   * @param newState
   */
  setState(newState?:any) {
    Object.keys(newState).map( key => this.state[key] = newState[key])
    this.render();
  }

  /**
   * Abstract method to be implemented, aiming at rendering the contents of this.htmlElement
   */
  abstract render(): void;
}
