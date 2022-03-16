import {data} from "./data";
import {ToolPanel} from "./ToolPanel";
import {addBodyNode, addHeadNode} from "./utils";

const id = "camunda-utils-button";

const buttonStyles = `<style>
    #${id} {
         position: fixed;
         right: 50%;
         top: 10px;
         z-index: 2000;
         background-color: aquamarine;
         font-size: 24px;
         border-style: dashed;
         padding: 5px;
         cursor: pointer;
    } 
</style>`;

export class UtilsButton {

    constructor() {
        addHeadNode(buttonStyles);
        addBodyNode(`<div id="${id}">UTILS</div>`);
        const el = this.getDiv();
        el.onclick = this.click.bind(this);
        data.utilsButton = this;
    }

    show(show: boolean) {
        this.getDiv().style.display = show ? 'block' : 'none';
    }

    private click() {
        if (!data.toolPanel) {
            data.toolPanel = new ToolPanel();
        } else {
            data.toolPanel.show();
        }
        this.show(false);
    }

    private getDiv(): HTMLDivElement {
        return document.querySelector(`#${id}`) as HTMLDivElement;
    }
}