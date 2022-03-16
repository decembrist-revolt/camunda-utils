# camunda-utils
Utils for camunda engine

Open console when you are in cockpit
Paste   
```
fetch("https://raw.githubusercontent.com/decembrist-revolt/camunda-utils/main/camunda-utils.js")
    .then(response => response.text())
    .then(text => eval(text))
```
Features:   
1. Retry/Delete all incident process instances
2. Retry/Delete all incident filtered by exceptionMessage
3. Print all incidents exceptions

For devs:
1. npm run build-prod (build everything to dist/bundle.js)
2. manually copy dist/bundle.js content to camunda-utils.js
3. push

You can manually copy bundle.js content to cockpit console to test   
`npm run start` to run devserver