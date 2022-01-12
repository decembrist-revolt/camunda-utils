fetch("https://cdnjs.cloudflare.com/ajax/libs/axios/0.24.0/axios.js")
    .then(response => response.text())
    .then(text => eval(text))

const command = prompt(`Sorry? 
 1: Deploy 
 2: Select and act
 `)

switch (command) {
    case "1":
        alert("Unsupported yet!");
        break;
    case "2":
        select();
        break;
    default:
        alert("Unsupported yet!");
}

async function select() {
    const selectAll = prompt("Select * from " +
        "\n 1: Definitions, " +
        "\n 2: Job")
    let result;
    switch (selectAll) {
        case "1":
            await handleDefinitions();
            break;
        case "2":
            await handleJobs();
            break;
        default:
            alert("Unsupported yet!");
    }
}

async function handleDefinitions() {
    const definitions = await selectDefinitions();
    const command = prompt(`${definitions.length} definitions found. What's next?
1: Just show
2: Just show Last versions
`);
    switch (command) {
        case "1":
            show(definitions);
            break;
        case "2":
            const maxVersions = [];
            for (let definition of definitions) {
                if (definitions.filter(def => def.key === definition.key && def.version > definition.version).length === 0) {
                    maxVersions.push(definition);
                }
            }
            show(maxVersions);
            break;
        default:
            alert("Unsupported yet!");
    }
}

async function selectDefinitions() {
    const config = {
        method: 'get',
        url: `http://${window.location.host}/rest/process-definition`,
        headers: {}
    };

    return await axios(config).then(response => response.data)
}

async function handleJobs() {
    const selectBy = prompt(`Select * by 
1: processDefinitionId
2: processDefinitionKey
`)
    const withException = prompt("With incident? 0/1");
    let query = {
        withException: withException === "1",
    }
    switch (selectBy) {
        case "1":
            query.processDefinitionId = prompt("processDefinitionId")
            break;
        case "2":
            query.processDefinitionKey = prompt("processDefinitionKey")
            break;
    }
    const jobs = await selectJobs(query)
    const command = prompt(`${jobs.length} jobs found. What's next?
1: Just show
2: Retry
3: Show errors
`);
    switch (command) {
        case "1":
            show(jobs);
            break;
        case "2":
            await retry(jobs);
            alert("DONE!")
            break;
        case "3":
            const exceptions = jobs.map(job => job.exceptionMessage)
            show([...(new Set(exceptions)).values()]);
            break;
        default:
            alert("Unsupported yet!");
    }

}

async function retry(jobs) {
    for (let job of jobs) {
        console.log("Try to retry " + job.id)
        const config = {
            method: 'put',
            url: `http://${window.location.host}/rest/job/${job.id}/retries`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({retries: 1})
        };

        await axios(config).then(response => response.data)
        console.log("Job retry+ " + job.id)
    }
}

async function selectJobs(query) {
    let queryString = ""
    for (let el in query) {
        queryString += `${el}=${query[el]}&`
    }
    const config = {
        method: 'get',
        url: `http://${window.location.host}/rest/job?${queryString}`,
        headers: {}
    };

    return await axios(config).then(response => response.data)
}

function show(data) {
    const string = JSON.stringify(data, null, "\t")
    console.log(string)
    alert(string)
}
