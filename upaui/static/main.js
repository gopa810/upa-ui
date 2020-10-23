function ProcessMessage(data) {
    alert(data)
}

function app_start()
{
    //Service("http://localhost:5050/service", ['command', 'load'])
    Service(['command', 'load'])
}