import {data} from "./data";
import {addBodyNode, addHeadNode, htmlToElement} from "./utils";
import {ProcessPanel} from "./ProcessPanel";
import {PROCESS_INFORMATION_CLASS} from "./cockpit";
import {JobsPanel} from "./JobsPanel";
import {JobsController} from "./JobsController";

const id = "camunda-utils-tool-panel";

const panelStyles = `<style>
    #${id} {
         position: fixed;
         left: 50%;
         top: 50%;
         z-index: 2000;
         background-color: aquamarine;
         font-size: 24px;
         border-style: dashed;
         padding: 5px;
         transform: translate(-50%, -50%);
         width: 80%;
         min-width: 700px;
    } 
    #${id} .close_button {
        height: 25px;
    }
    
    #${id} .close_button button {
        float: right;
        height: 25px;
        font-family: Arial;
        font-size: 15px;
    }
    
    #${id} .error {
        background-color: #ff7f7f;
    }
</style>`;

export class ToolPanel {
    private errors: Node[] = [];
    private readonly processPanel: ProcessPanel;
    private readonly jobsPanel: JobsPanel;
    private readonly jobsController: JobsController;

    constructor() {
        addHeadNode(panelStyles);
        addBodyNode(`
        <div id="${id}">
            <div class="close_button">
                <button>x</button>
            </div>
        </div>`);
        const closeButton = document.querySelector(`#${id} .close_button`) as HTMLButtonElement;
        closeButton.onclick = this.close.bind(this);
        this.processPanel = new ProcessPanel(this);
        this.jobsPanel = new JobsPanel(this, this.renderContent.bind(this));
        this.jobsController = new JobsController(this, this.renderContent.bind(this));
        this.renderContent();
    }

    show() {
        this.getDiv().style.display = 'block';
        this.renderContent();
    }

    renderContent() {
        if (document.querySelector(`.${PROCESS_INFORMATION_CLASS}`)) {
            this.processPanel.show();
            this.jobsPanel.show();
        }
        if (data.jobs && data.jobs.length > 0) {
            this.jobsController.show();
        }
    }

    addChild(html: string) {
        let element = htmlToElement(html);
        this.getDiv().appendChild(element)
    }

    private close() {
        this.errors.forEach(node => this.getDiv().removeChild(node));
        this.errors = [];
        this.getDiv().style.display = 'none';
        this.processPanel.hide();
        data.utilsButton?.show(true);
    }

    private getDiv(): HTMLDivElement {
        return document.querySelector(`#${id}`) as HTMLDivElement;
    }
}