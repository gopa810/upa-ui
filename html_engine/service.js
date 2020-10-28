function ServiceAsync(url, postData) {
    //ProcessMessage('{ "command": "clrscr" }')
    message = [[ "clrscr"],
        ["setHTML", {
            "target-id": "screen",
            "data": [
                {
                    "tag": "div",
                    "id": "ed1",
                    "style": "display:block;position:absolute;background:green;",
                    "_items": [
                        {
                            "tag": "div",
                            "id": "ed1_1",
                            "style": "background:lightblue;position:absolute"
                        },
                        {
                            "tag": "div",
                            "id": "ed1_2",
                            "style": "background:lightblue;position:absolute"
                        }                        
                    ]
                },
                {
                    "tag": "div",
                    "id": "ed2",
                    "style": "position:absolute;padding:18pt;border:1px solid blue;background:yellow;",
                    "_items": [
                        "Some text here\nin second line"
                    ]
                },
                {
                    "tag": "img",
                    "id": "img1",
                    "style": "position:absolute",
                    "src": "image1.png",
                    "width": "100px",
                    "height": "130px"
                }
            ],
            //"html": "<div id=\"ed1\" style=\"\"></div><div style=\"position:relative;right:10px;bottom:10px;\">Some text is here<br>in second line</div>",
            "resizes": [
                ["ed1", 0, 0, '10'],
                ["ed1", 0, 1, '10'],
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
            ]
        }]]
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