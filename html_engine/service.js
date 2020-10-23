function ServiceAsync(url, postData) {
    ProcessMessage('some text')
}

function ServiceSync(url, postData) {
    ServiceAsync(url, postData)
}

function Service(message) {
    ServiceAsync("service", message)
}