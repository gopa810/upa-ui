// old function for eavluation
// of expression, that is used for calculation
// of size during resizing event

function eval_size_val(elemItem, arr) {
    if (arr === null) {
        return null;
    } else if (typeof(arr) == "number") {
        return arr;
    } else if (arr instanceof String) {
        return parseInt(arr);
    } else if (arr instanceof Array) {
        switch (arr[0]) {
            case "+":
                var s = eval_size_val(elemItem, arr[1]);
                for (let i = 2; i < arr.length; i++) {
                    s += eval_size_val(elemItem, arr[i]);
                }
                //console.log(arr.toString() + '==>' + s);
                return s
            case "-":
                var s = eval_size_val(elemItem, arr[1]);
                for (let i = 2; i < arr.length; i++) {
                    s -= eval_size_val(elemItem, arr[i]);
                }
                //console.log(arr.toString() + '==>' + s);
                return s
            case "%":
                var s = eval_size_val(elemItem, arr[1]);
                for (let i = 2; i < arr.length; i++) {
                    s *= (eval_size_val(elemItem, arr[i]) / 100.0);
                }
                //console.log(arr.toString() + '==>' + s);
                return s
            case "*":
                var s = eval_size_val(elemItem, arr[1]);
                for (let i = 2; i < arr.length; i++) {
                    s *= eval_size_val(elemItem, arr[i]);
                }
                //console.log(arr.toString() + '==>' + s);
                return s
            case "/":
                var s = eval_size_val(elemItem, arr[1]);
                for (let i = 2; i < arr.length; i++) {
                    s /= eval_size_val(elemItem, arr[i]);
                }
                //console.log(arr.toString() + '==>' + s);
                return s
            case "W":
                var elem = getElem(arr[1]);
                //console.log(arr.toString() + '==>' + elem.offsetWidth);
                return parseInt(elem.offsetWidth);
            case "H":
                var elem = getElem(arr[1]);
                //console.log(arr.toString() + '==>' + elem.offsetHeight);
                return parseInt(elem.offsetHeight);
            case "T":
                var elem = getElem(arr[1]);
                return elem.offsetTop;
            case "L":
                var elem = getElem(arr[1]);
                return elem.offsetLeft;
            case "R":
                var elem = getElem(arr[1])
                return parseInt(elem.offsetLeft) + parseInt(elem.offsetWidth);
            case "B":
                var elem = getElem(arr[1])
                return parseInt(elem.offsetTop) + parseInt(elem.offsetHeight);
            case "HP":
                var elem = elemItem.parentNode
                return parseInt(elem.offsetHeight)
            case "WP":
                var elem = elemItem.parentNode
                return parseInt(elem.offsetWidth)
        }
    } else {
        return 0;
    }

}
