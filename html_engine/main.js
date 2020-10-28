function ProcessMessage(data) {
    console.log(data)
    cmds = JSON.parse(data)
    if (cmds instanceof Array) {
        console.log(cmds)
        for (var k in cmds) {
            item = cmds[k]
            if (item instanceof String) {
                //console.log('Item ' + k + ' is string');
            } else if (item instanceof Array) {
                //console.log('Item ' + k + ' is array');
                //console.log('Size: ' + item.length)
                ExecuteCommand(item)
            } else {
                //console.log(typeof(item))
            }
        }
    } else {
        //console.log('First level of object has to be array')
    }
}

function getElem(id) {
    return document.getElementById(id);
}

g_resizes = []

function Data2Elem(arr) {
    var elements = []
    arr.forEach(elem => {
        if (typeof(elem) == 'string') {
            //console.log('--------xxs' + elem)
            var e = document.createTextNode(elem);
            elements.push(e)
        } else if (typeof(elem) == 'object') {
            var e = document.createElement(elem['tag']);
            Object.keys(elem).forEach(key => {
                //console.log('--------xx---aa ' + key)
                var val = elem[key]
                switch(key) {
                    case '_items':
                        for (var e2 of Data2Elem(val)) {
                            console.log('---logs----')
                            e.appendChild(e2)
                        }
                        break;
                    case 'style':
                        e.style = val;
                        break;
                    default:
                        e.setAttribute(key, val);
                        break;
                }
            })
            elements.push(e)
        }
    })
    return elements
}

// argument is array
function ExecuteCommand(cmd) {
    if (cmd.length > 0) {
        console.log(cmd[0])
        if (cmd[0] == 'clrscr') {
            var scr = getElem('screen')
            scr.innerHTML = ""
        } else if (cmd[0] == 'createWindow') {
            if (cmd.length > 1) {
                Execute_CreateWindow(cmd[1])
            }
        } else if (cmd[0] == 'setHTML') {
            if (cmd.length > 1 && (cmd[1] instanceof Object)) {
                var args = cmd[1]
                g_resizes = [];
                if (args['resizes'] != null) {
                    for (var rule of args['resizes']) {
                        var tkns = parseExpression(rule[3]);
                        var opers = flattenExpression(tkns);
                        //console.log('------------------------')
                        //console.log(rule[3])
                        //console.log(opers)
                        g_resizes.push([rule[0], rule[1], rule[2], opers])
                    }
                }
                var telem = getElem(args["target-id"])
                if (args['html'] != null) {
                    telem.innerHTML = args["html"];
                } else if (args['data'] != null) {
                    telem.innerHTML = ""
                    for (var subElem of Data2Elem(args['data'])) {
                        telem.appendChild(subElem)
                    }
                }
                on_resize_screen()
            }
        }
    }
}

function Execute_CreateWindow(data) {
    var scr = getElem('screen')
    scr.innerHTML = ""

    var e1 = document.createElement("div")
    e1.style.position = 'relative'
    e1.style.top = '10px'
    e1.style.left = '10px'
    e1.style.width = '300px'
    e1.style.height = '200px'
    e1.style.border = '1px solid black'
    e1.style.background = 'yellow'


    scr.appendChild(e1)

    e1.innerText = "Screen dimensions: (" + scr.offsetWidth + " x " + scr.offsetHeight + ")\n"
        + "Div dimensions: (" + e1.offsetWidth + " x " + e1.offsetHeight + ")"

}

function app_start()
{
    //Service("http://localhost:5050/service", ['command', 'load'])
    Service(['command', 'load'])
}

function eval_size_val(elemItem, arr) {
    var stack = [];
    var value;

    while(arr.length > 0) {
        var item = arr.shift();
        switch (item[0]) {
            case 0: // object name
                if (item[1] == 'self') {
                    stack.push(elemItem);
                } else if (item[1] == 'parent') {
                    stack.push(elemItem.parentNode);
                } else {
                    stack.push(document.getElementById(item[1]));
                }
                break;
            case 1: // binary operator
                var B = stack.pop();
                var A = stack.pop();
                switch (item[1]) {
                    case '+':
                        stack.push(A + B);
                        break;
                    case '-':
                        stack.push(A - B);
                        break;
                    case '*':
                        stack.push(A * B);
                        break;
                    case '/':
                        stack.push(A / B);
                        break;
                    case '%':
                        stack.push(A * B/100.0);
                        break;
                    case '.':
                        switch(B) {
                            case 'width':
                                value = A.clientWidth;
                                break;
                            case 'height':
                                value = A.clientHeight;
                                break;
                            case 'top':
                                value = A.clientTop;
                                break;
                            case 'left':
                                value = A.clientLeft;
                                break;
                            default:
                                value = 0;
                                break;
                        }
                        stack.push(value);
                        break;
                    }
                break;
            case 2: // number
                stack.push(item[1]);
                break;
            case 3: // property
                stack.push(item[1]);
                break;
            case 4: // unary operator
                var A = stack.pop();
                switch (item[1]) {
                    case '-':
                        stack.push(-A);
                        break;
                }
                break;
        }
    }

    return stack[0];
}

function on_resize_screen() {
    var bel = getElem('screen');
    var bed1 = getElem('ed1');
    var bed3 = getElem('ed2');
    var s1 = ""
    g_resizes.forEach(res => {
        var resized_element_id = res[0]
        var resize_target_type = res[1]
        var resize_side = res[2]
        var elem = getElem(resized_element_id)
        var value = eval_size_val(elem, res[3])
        if (resize_target_type == 0) {
            switch (resize_side) {
                case 0: // left
                    elem.style.left = "" + value + "px";
                    break;
                case 1: // top
                    elem.style.top = "" + value + "px";
                    break;
                case 2: // right
                    elem.style.right = "" + value + "px";
                    break;
                case 3: // bottom
                    elem.style.bottom = "" + value + "px";
                    break;
                case 4: // width
                    elem.style.width = "" + value + "px";
                    break;
                case 5: // height
                    elem.style.height = "" + value + "px";
                }
        } else if (resize_target_type == 1) {
            // resizing element's width, height
            switch (resize_side) {
                case 0: // left
                    elem.offsetLeft = "" + value + "px";
                    break;
                case 1: // top
                    elem.offsetTop = "" + value + "px";
                    break;
                case 2: // right
                    elem.offsetRight = "" + value + "px";
                    break;
                case 3: // bottom
                    elem.offsetBottom = "" + value + "px";
                    break;
                case 4: // width
                    elem.offsetWidth = "" + value + "px";
                    break;
                case 5: // height
                    elem.offsetHeight = "" + value + "px";
                }
        }
        s1 += res[0]
    });

    s1 += '\n';

    //bed1.innerText = s1 + 'String: ' + bed3.offsetLeft + ', ' + bed3.offsetTop + ', ' 
    //    + bed3.offsetWidth + ", " + bed3.offsetHeight + "\n\n" + 
    //    + getElem('screen').offsetHeight + ', H2=' + getElem('ed2').offsetHeight
}
