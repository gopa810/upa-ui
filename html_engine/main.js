function UPA_ProcessTextMessage(message) {

    var p = message
    var tags = [];
    var nidx = -1
    var pidx = -1
    var eidx = -1
    var cmdend = -1;
    var value = ''
    var d = {}


    tags = p.match(/\<\|[A-Z]+\|\>/gi);
    pidx = 0
    var currtag = ''
    for (var tag of tags) {
        eidx = message.indexOf(tag, pidx);
        //console.log('indexOf --->' + tag + ' = ' + eidx.toString());
        if (nidx >= 0) {
            value = message.substring(nidx,eidx).trim();
            if (currtag == '<|CMD|>') {
                UPA_ExecuteCommand(d);
                d = {}
            }
            d[currtag.substring(2,currtag.length-2)] = value
            //console.log(currtag + '===>');
            //console.log(value);
        }
        currtag = tag;
        nidx = eidx + tag.length;
        pidx = nidx
    }

    value = message.substring(nidx)
    if (currtag == '<|CMD|>') {
        UPA_ExecuteCommand(d);
        d = {}
    }
    //console.log(currtag + '===>');
    //console.log(value);
    d[currtag.substring(2, currtag.length - 2)] = value;
    UPA_ExecuteCommand(d);
}

function UPA_ExecuteCommand(d) {
    if ('CMD' in d) {
        console.log(d);
        switch(d['CMD']) {
            case 'clrscr':
                var scr = getElem('screen')
                scr.innerHTML = ""
                break;
            case 'setHTML':
                var target = 'screen';
                if ('TARGET' in d) {
                    target = d['TARGET'];
                }
                var scr = getElem(target);
                if ('BODY' in d) {
                    scr.innerHTML = d['BODY'];
                }
                break;
            case 'showDialog':
                var d1 = getElem("dialoglayer");
                var d2 = getElem("dialogbox");
                if ('BODY' in d) {
                    d2.innerHTML = d['BODY'];
                }
                d1.style.display = "block";
                break;
            case 'closeDialog':
                var d1 = getElem('dialoglayer');
                d1.style.display = 'none';
                break;
            default:
                break;
        }
    }
}

function getElem(id) {
    return document.getElementById(id);
}


function app_start()
{
    //Service("http://localhost:5050/service", ['command', 'load'])
    UPA_Service(['command', 'load'])
}



