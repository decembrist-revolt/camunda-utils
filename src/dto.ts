interface Job {
    id: string,
    jobDefinitionId: string,
    processInstanceId: string,
    processDefinitionId: string,
    processDefinitionKey: string,
    executionId: string,
    exceptionMessage: string,
    retries: number,
    createTime: string,
}