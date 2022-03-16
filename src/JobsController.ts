import {ToolPanel} from "./ToolPanel";
import {data} from "./data";
import {addHeadNode, htmlToElement} from "./utils";
import {CamundaService} from "./CamundaService";

const id = "camunda-utils-jobs-controller";
const jobsControllerClass = 'jobs_controller';
const jobsProgressClass = 'jobs_progress';

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
    .${jobsControllerClass} button {
        font-size: 24px;
    }
</style>`;

export class JobsController {
    private buttons: HTMLButtonElement[];

    constructor(parent: ToolPanel, private refresh: () => void) {
        addHeadNode(panelStyles);
        parent.addChild(`
            <div id="${id}">
                <div class="${jobsControllerClass}">
                    <button>Retry</button>
                    <button>Delete</button>
                    <button>Filter incident</button>
                    <button>Print</button>
                    <button>Print unique</button>
                </div>
            </div>
        `);
        const retryButton =
            document.querySelector(`.${jobsControllerClass} > button:nth-child(1)`) as HTMLButtonElement;
        const deleteButton =
            document.querySelector(`.${jobsControllerClass} > button:nth-child(2)`) as HTMLButtonElement;
        const filterButton =
            document.querySelector(`.${jobsControllerClass} > button:nth-child(3)`) as HTMLButtonElement;
        const printButton =
            document.querySelector(`.${jobsControllerClass} > button:nth-child(4)`) as HTMLButtonElement;
        const printUniqueButton =
            document.querySelector(`.${jobsControllerClass} > button:nth-child(5)`) as HTMLButtonElement;
        this.buttons = [retryButton, deleteButton, filterButton, printButton, printUniqueButton];
        retryButton.onclick = this.retry.bind(this);
        deleteButton.onclick = this.delete.bind(this);
        filterButton.onclick = this.filter.bind(this);
        printButton.onclick = this.print.bind(this);
        printUniqueButton.onclick = this.printUnique.bind(this);
        this.hide();
    }

    show() {
        this.getDiv().style.display = 'block';
    }

    hide() {
        this.getDiv().style.display = 'none';
    }

    private async retry() {
        const jobs = data.jobs!;
        if (!window.confirm(`Retry ${jobs?.length} incidents?`)) return;
        this.enableButtons(false);
        await this.doWithProgress(jobs, async (job: Job) => {
            try {
                console.log(`Try to retry job ${job.id}.`)
                await CamundaService.instance.retry(job.id)
                console.log(`Job ${job.id} retried.`)
            } catch (ex) {
                console.log(`Job ${job.id} retry failed.`)
                console.error(ex);
            }
        });
        alert("Done!");
        this.enableButtons(true);
    }

    private async delete() {
        const jobs = data.jobs!;
        if (!window.confirm(`Delete ${jobs?.length} incidents?`)) return;
        this.enableButtons(false);
        await this.doWithProgress(jobs, async (job: Job) => {
            try {
                console.log(`Try to delete job ${job.id}.`)
                await CamundaService.instance.deleteProcessInstance(job.processInstanceId)
                console.log(`Job ${job.id} deleted.`)
            } catch (ex) {
                console.log(`Job ${job.id} delete failed.`)
                console.error(ex);
            }
        });
        alert("Done!");
        this.enableButtons(true);
    }

    private filter() {
        let exceptionMessage = prompt("Filter by exceptionMessage");
        if (!exceptionMessage) return;
        data.jobs = data.jobs?.filter(job => job.exceptionMessage === exceptionMessage);
        console.log(`${data.jobs?.length} jobs filtered`);
        this.refresh();
    }

    private print() {
        const string = JSON.stringify(data.jobs, null, "\t")
        console.log(string)
    }

    private printUnique() {
        const exceptionMap = new Map();
        data.jobs?.forEach(job => exceptionMap.set(job.exceptionMessage, job));
        const string = JSON.stringify(Array.from(exceptionMap.values()), null, "\t")
        console.log(`Unique result by exception cont: ${exceptionMap.size}`)
        console.log(string)
    }

    private async doWithProgress(jobs: Job[], callback: (job: Job) => Promise<void>) {
        const progressBar = htmlToElement(`
            <div class="${jobsProgressClass}">
                <progress id="file" max="100" value="0"></progress>
            </div>
        `);
        this.getDiv().appendChild(progressBar);
        const progress = document.querySelector(`.${jobsProgressClass} progress`) as HTMLProgressElement;
        const progressStep = 100 / jobs.length;
        for (let job of jobs) {
            await callback(job);
            progress.value += progressStep;
        }
        progress.parentElement!.remove();
    }

    private enableButtons(enable: boolean) {
        this.buttons.forEach(button => button.disabled = !enable);
    }

    private getDiv(): HTMLDivElement {
        return document.querySelector(`#${id}`) as HTMLDivElement;
    }
}