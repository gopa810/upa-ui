function UPA_ServiceAsync(url, postData) {
    var message = `<|CMD|>clrscr
    <|CMD|>setHTML
    <|BODY|> 
    <div style='width:300px;height:400px;background:yellow;'>
    </div>
    <|CMD|>exit`

    UPA_ProcessTextMessage(message);
}

function UPA_ServiceSync(url, postData) {
    UPA_ServiceAsync(url, postData)
}

function UPA_Service(message) {
    UPA_ServiceAsync("service", message)
}