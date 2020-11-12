function ServiceAsync(url, postData) {
    //ProcessMessage('{ "command": "clrscr" }')
    message = [[ "clrscr"],
        ["setHTML", {
            "target-id": "screen",
            "data": [
                {
                    "control": "verticalgrid",
                    "size": "full",
                    "data": [
                        {
                            "size": "content",
                            "control": "mainmenu", 
                            "data": [
                                {"text": "GCAL", "action": [ [ "CmdProps" ] ] },
                                {"text": "File", "action": [ [ "CmdFile", "OpenFile" ] ] },
                                {"text": "Edit"},
                                {
                                    "text": "Settings",
                                    "data": [
                                        { "text": "Display settings"},
                                        { "text": "Application Settings"}
                                    ]
                                },
                                {"text": "Help"}
                            ]
                        },
                        {
                            "size": "full",
                            "control": "webview",
                            "style": {
                                "width": "auto"
                            },
                            "data": {
                                "source": "today.html"
                            }
                        }
                    ]
                }
            ]
            //"html": "<div id=\"ed1\" style=\"\"></div><div style=\"position:relative;right:10px;bottom:10px;\">Some text is here<br>in second line</div>",
            /*"resizes": [
                ["ed1", 0, 0, '10'],
                ["ed1", 0, 1, '50'],
                ["ed1", 0, 4, '{screen}.width - 300'],
                ["ed1", 0, 5, '{screen}.height / 2'],
                ["ed1_1", 0, 0, '10'],
                ["ed1_1", 0, 1, '10'],
                ["ed1_1", 0, 4, '({parent}.width % 50) - 15'],
                ["ed1_1", 0, 5, '{parent}.height - 20'],
                ["ed1_2", 0, 0, '({parent}.width % 50) + 5'],
                ["ed1_2", 0, 1, '10'],
                ["ed1_2", 0, 4, '({parent}.width % 50) - 15'],
                ["ed1_2", 0, 5, '{parent}.height - 20'],
                ['ed2', 0, 0, '{screen}.width - {self}.width - 20'],
                ['ed2', 0, 1, '{screen}.height - {self}.height - 20'],
                ['img1', 0, 0, '30'],
                ['img1', 0, 1, '{parent}.height - 120']
            ]*/
        }],
        ["showDialog", {
            "control": "verticalgrid",
            "data": [
                {
                    "control": "titlebar",
                    "plain": "Decision 0/1"
                },
                {
                    "control": "verticalgrid",
                    "padding": "8pt",
                    "data": [{
                        "control": "label",
                        "plain": "Do you want to start now?"
                    }]
                },
                {
                    "control": "row-right",
                    "padding": "8pt",
                    "data": [
                        {
                            "control": "button",
                            "plain": "OK",
                            "action": [ ["CloseDialog", "Continue"] ]
                        },
                        {
                            "control": "button",
                            "plain": "Cancel",
                            "action": [ ["CloseDialog"] ]
                        },
                    ]
                }
            ]
        }]
   
    ]
    ProcessMessage(
        JSON.stringify(message)
    )
}

function ServiceSync(url, postData) {
    ServiceAsync(url, postData)
}

function Service(message) {
    ServiceAsync("service", message)
}