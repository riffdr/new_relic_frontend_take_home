                <span>${n}</span>
                <h3>${e}</h3>
            </div>`;this.getHostCardMarkup=(e,n,o=5)=>{let i="";o=o<e.length?o:e.length;for(let r=0;r<o;r++){let c=e[r];i+=this.getAppListMarkup(c,this.dataManager.appProxy[c].apdex,this.dataManager.appProxy[c].version)}return`<div class="nr-host-card">
                <h2>${n}</h2>
                ${i}
            </div>`};this.getMarkup=e=>{let n="";for(let o=0;o<e.length;o++){let i=e[o];n+=this.getHostCardMarkup(this.dataManager.getTopAppsByHost(i),i)}return n};this.dataManager=new m,this.state.hostList=this.dataManager.getHostNames(),this.htmlElement.addEventListener("click",this.clickHandler,{capture:!0}),this.render(),this.testNonUIVisibleActions()}render(){this.htmlElement.innerHTML=this.getMarkup(this.state.hostList)}},u=document.querySelector(".nr-host-container");u&&new f(u);