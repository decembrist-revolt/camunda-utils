import {ToolPanel} from "./ToolPanel";
import {addHeadNode} from "./utils";
import {PROCESS_INFORMATION_CLASS} from "./cockpit";
import {data} from "./data";

const id = "camunda-utils-process-panel";
const definitionIdClass = 'definition_id';
const definitionKeyClass = 'definition_key';

const panelStyles = `<style>
    #${id} {
        width: 100%;
    } 
    #${id} div {
        font-size: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-align: center;
        margin-bottom: 10px;
    }
</style>`;

export class ProcessPanel {

    constructor(parent: ToolPanel) {
        addHeadNode(panelStyles);
        parent.addChild(`
            <div id="${id}">
                <div class="${definitionIdClass}"></div>
                <div class="${definitionKeyClass}"></div>
            </div>
        `);
        this.hide();
    }

    hide() {
        this.getDiv().style.display = 'none';
    }

    show() {
        const definitionIdSpan = document.querySelector(`.${definitionIdClass}`) as HTMLDivElement;
        data.processDefinitionId =
            document.querySelector(`.${PROCESS_INFORMATION_CLASS} .definition-id`)!.textContent!.trim();
        const definitionKeySpan = document.querySelector(`.${definitionKeyClass}`) as HTMLDivElement;
        data.processDefinitionKey =
            document.querySelector(`.${PROCESS_INFORMATION_CLASS} .definition-key`)!.textContent!.trim();

        definitionIdSpan.innerText = `Definition ID = ${data.processDefinitionId}`;
        definitionKeySpan.innerText = `Process = ${data.processDefinitionKey}`;
        this.getDiv().style.display = 'block';
    }

    private getDiv(): HTMLDivElement {
        return document.querySelector(`#${id}`) as HTMLDivElement;
    }
}