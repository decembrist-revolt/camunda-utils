import {UtilsButton} from "./UtilsButton";
import {ToolPanel} from "./ToolPanel";

interface UtilsData {
    utilsButton: UtilsButton | undefined,
    toolPanel: ToolPanel | undefined,
    processDefinitionId: string | undefined,
    processDefinitionKey: string | undefined,
    jobs: Job[] | undefined,
}

export const data: UtilsData = {
    toolPanel: undefined,
    utilsButton: undefined,
    processDefinitionId: undefined,
    processDefinitionKey: undefined,
    jobs: undefined,
};