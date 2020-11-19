function UPA_ServiceAsync(url, postData) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
           //document.getElementById("demo").innerHTML = xhttp.responseText;
           UPA_ProcessTextMessage(xhttp.responseText)
        }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhttp.send(JSON.stringify(postData));
}

function UPA_ServiceSync(url, postData) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", url, false);
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xmlhttp.send(JSON.stringify(postData))
    var responseText = xmlhttp.responseText;
    UPA_ProcessTextMessage(responseText);
}

function Service(message) {
    UPA_ServiceAsync("service", message)
}