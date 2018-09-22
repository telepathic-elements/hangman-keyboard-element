import {TelepathicElement} from "../telepathic-element/telepathic-element.js";

export default class HangmanKeyboardElement extends TelepathicElement{
    constructor(){
        super(null,true);//This is a sub element, disable shadowdom
        this.gameEl = document.querySelector('hangman-game-element');
    }

    static get observedAttributes() {
        return ['lastkeypress','reset'];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        console.log(attrName+" changed from "+oldVal+" to "+newVal);
        switch(attrName){
            case "lastkeypress": {
                let btn = this.$.querySelector(`#${newVal}`);
                console.log("btn in attrChange is: ",btn);
                if(btn){
                    btn.disabled = true;
                }
                break;
            }
            case "reset" : {
                let btns = this.$.querySelectorAll('button');
                btns.forEach((btn)=>{
                    btn.disabled = false;
                });
                break;
            }   
        }
        this.gameEl.setAttribute(attrName,newVal);
    }
    async init(){
        for (let i = 0; i < 26; i++) {
            let btn = document.createElement("button");
            let id = String.fromCharCode(65 + i);
            btn.innerHTML = id;
            btn.setAttribute("id",id);
            btn.style.display = "inline";
            btn.onclick = this.onAction;
            this.$.appendChild(btn);
        }
        let btn = document.createElement("button");
        btn.setAttribute("id","reset");
        btn.innerHTML = "Reset";
        btn.onclick = this.reset;
        this.$.appendChild(btn);
    }

    reset(event){
        this.parentElement.setAttribute("reset",new Date());
    }
    subscribe(obj){
        console.log("have a subscription from ",obj);
        this.subscribers.push(obj);
    }

    onAction(event){
        console.log(event," occured");
        let btn = event.path[0];
        this.parentElement.setAttribute('lastkeypress',btn.id);
        //event.sourceElement.setAttribute("lastkey",btn.id);
    }
}