import { Component } from './index';

let component:any;
beforeEach(() => {
  document.body.innerHTML = "";
  component = document.createElement("div");
  component.className = 'test';
  document.body.appendChild(component);
});

afterEach(() => {
  document.body.innerHTML = "";
});


class StubbedComponent extends Component {
  constructor(assignedElement: Element) {
    super(assignedElement);
    this.state.info = 'this is a string';
    this.render();
  };

  updateComponent = (data: string): void => {
    this.setState({
      info: data
    })
  };
  render():void {
    this.htmlElement.innerHTML = this.state.info;
  };
};

describe('Workings of an implementation of the Component class ',() => {
  it('stubbedComponent renders correctly state contents',() => {
    const stubbedComponent = new StubbedComponent(component);
    expect(stubbedComponent.state.info).toBe('this is a string');
    expect(component.innerHTML).toEqual('this is a string');
  });

  it('stubbedComponent updates correctly both the html and the state when updating the state via Abstract Component.setState()',() => {
    const stubbedComponent = new StubbedComponent(component);

    stubbedComponent.updateComponent('new content')
    expect(stubbedComponent.state.info).toBe('new content');
    expect(component.innerHTML).toEqual('new content');
  });

});
