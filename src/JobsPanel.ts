import {ToolPanel} from "./ToolPanel";
import {data} from "./data";
import {addHeadNode} from "./utils";
import {CamundaService} from "./CamundaService";

const id = "camunda-utils-jobs-panel";
const processPanelController = 'process_panel_controller';
const incidentJobsCountClass = 'incident_jobs_count';

const panelStyles = `<style>
    #${id} {
        width: 100%;
    } 
    #${id} div {
        font-size: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-align: center;
        margin-bottom: 20px;
    }
    .${processPanelController} button {
        font-size: 24px;
    }
</style>`;

export class JobsPanel {

    constructor(parent: ToolPanel, private refresh: () => void) {
        addHeadNode(panelStyles);
        parent.addChild(`
            <div id="${id}">
                <div class="${incidentJobsCountClass}"></div>
                <div class="${processPanelController}">
                    <button>Scan definition id incidents</button>
                    <button>Scan process incidents</button>
                </div>
            </div>
        `);
        const scanDefinitionJobsButton =
            document.querySelector(`.${processPanelController} > button:nth-child(1)`) as HTMLButtonElement;
        const scanProcessJobsButton =
            document.querySelector(`.${processPanelController} > button:nth-child(2)`) as HTMLButtonElement;
        scanDefinitionJobsButton.onclick = this.scanDefinitionJobs.bind(this);
        scanProcessJobsButton.onclick = this.scanProcessJobs.bind(this);
        this.hide();
    }

    show() {
        this.getDiv().style.display = 'block';
        this.refreshIncidentCount();
    }

    hide() {
        this.getDiv().style.display = 'none';
    }

    private async scanDefinitionJobs() {
        data.jobs = await CamundaService.instance.searchJobs(data.processDefinitionId!);
        this.refreshIncidentCount();
        this.logJobs();
        this.refresh();
    }

    private async scanProcessJobs() {
        data.jobs = await CamundaService.instance.searchJobs(undefined, data.processDefinitionKey!);
        let incidentCount = data.jobs.length;
        document.querySelector(`.${incidentJobsCountClass}`)!.textContent =
            `Process incident count = ${incidentCount}`
        this.logJobs();
        this.refresh();
    }

    private logJobs() {
        let incidentCount = data.jobs!.length;
        const versions = data.jobs!.map(job => job.processDefinitionId.split(":")[1]);
        console.log(`Found ${incidentCount} incidents. Affected versions: ${Array.from(new Set(versions))}`);
    }

    private refreshIncidentCount() {
        if (data.jobs) {
            let incidentCount = data.jobs?.length || 0;
            document.querySelector(`.${incidentJobsCountClass}`)!.textContent =
                `Definition incident count = ${incidentCount}`
        }
    }

    private getDiv(): HTMLDivElement {
        return document.querySelector(`#${id}`) as HTMLDivElement;
    }
}