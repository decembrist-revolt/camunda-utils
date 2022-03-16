import {ADDRESS} from "./cockpit";

export class CamundaService {

    public static instance = new CamundaService();

    private constructor() {
    }

    async searchJobs(
        processDefinitionId: string | undefined = undefined,
        processDefinitionKey: string | undefined = undefined
    ): Promise<any[]> {
        if (!processDefinitionId && !processDefinitionKey) throw "processDefinitionId processDefinitionKey is empty";
        const requestOptions = {
            method: 'get',
            headers: new Headers()
        };
        const query = processDefinitionId
            ? `processDefinitionId=${processDefinitionId!}`
            : `processDefinitionKey=${processDefinitionKey!}`;
        return await fetch(`${ADDRESS()}/rest/job?${query}&withException=true`, requestOptions)
            .then(response => {
                if (response.status !== 200) throw `200 status expected, but ${response.status} received`;
                return response.json();
            })
            .catch(reason => {
                console.log(reason);
                return [];
            });
    }

    async retry(jobId: string) {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({retries: 1})
        };
        const result = await fetch(`${ADDRESS()}/rest/job/${jobId}/retries`, requestOptions);
        if (result.status !== 204) throw `204 status expected, but ${result.status} received`;
    }

    async deleteProcessInstance(processInstanceId: string) {
        const requestOptions = {
            method: 'DELETE',
            headers: new Headers(),
        };
        const result = await fetch(`${ADDRESS()}/rest/process-instance/${processInstanceId}`, requestOptions);
        if (result.status !== 204) throw `204 status expected, but ${result.status} received`;
    }
}