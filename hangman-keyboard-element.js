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
                    btn.classList.remove("green-button");
                    btn.classList.add("red-button");
                }
                break;
            }
            case "reset" : {
                let btns = this.$.querySelectorAll('button');
                btns.forEach((btn)=>{
                    if(btn.id =="reset"){
                        return;
                    }
                    btn.disabled = false;
                    btn.classList.remove("red-button");
                    btn.classList.add("green-button");
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
            btn.classList.add("green-button");
            btn.classList.add("rounded-button");
           
            btn.style.display = "inline";
            btn.onclick = this.onAction;
            this.$.appendChild(btn);
        }
        let btn = document.createElement("button");
        btn.setAttribute("id","reset");
        btn.innerHTML = "Reset";
        btn.classList.add("red-button");
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
        let btn;
        try{
            btn = event.path[0];
        }catch(err){
            //Firefox has issues with event.path likely due to no proper shadowdom support
            console.warn(err);
            btn = event.originalTarget;
        }
        this.parentElement.setAttribute('lastkeypress',btn.id);
        //event.sourceElement.setAttribute("lastkey",btn.id);
    }
}