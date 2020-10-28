
function parseExpression(str) {
  var mode = 0
  var tokens = []
  var number_name = ''
  var token_name = ''
  var object_name = ''

  for (var a of (str + ' ')) {
      if (mode == 4) {
          if (a == ' ') {}
          else if (a.match(/^[0-9]+$/)) {
            number_name = '0.';
            mode = 2;
          } else if (a.match(/^[a-zA-Z_]+$/)) {
            tokens.push([1, '.']);
            mode = 1;
          } else {
            tokens.push([1, '.']);
            mode = 0;
          }
      }
      if (mode == 3) {
        if (a == '}') {
          tokens.push([0, object_name]);
          object_name = '';
          a = '';
          mode = 0;
        } else {
          object_name += a;
        }
      }
      if (mode == 2) {
        if (a.match(/^[0-9\.]+$/)) {
          number_name += a;
        } else {
          tokens.push([2, number_name]);
          number_name = '';
          mode = 0;
        }
      }
      if (mode == 1) {
        if (a.match(/^[a-zA-Z0-9_]+$/)) {
          token_name += a;
        } else {
          tokens.push([3, token_name]);
          token_name = '';
          mode = 0;
        }
      }
      if (mode == 0) {
        if (a.match(/^[a-zA-Z_]+$/)) {
          token_name = a;
          mode = 1;
        } else if (a.match(/^[0-9]+$/)) {
          number_name = a;
          mode = 2;
        } else if (a == '.') {
          mode = 4;
        } else if (a == '{') {
          mode = 3;
          object_name = ''
        } else if (a.match(/^[\+\-\*\/\%\(\)]+$/)) {
          tokens.push([1, a])
        }
      }
  }

	return tokens;
}

function checkOperatorUnity(oper, last) {
    if (last == 0) {
        return 2;
    }
    if (oper == '-') {
        return 1;
    }
    if (oper == '+') {
        return 1;
    }
    return 2;
}

function getOperatorPriority(oper, last) {
	switch(oper) {
  case '(': case ')':
  	return 6;
  case '.':
  	return 5;
  case '*': case '/': case '%':
  	return 2;
  case '+': case '-':
    if (last != 0) {
    	return 3;
    }
  	return 1;
  default:
  	return 0;
  }
}

function item2_to_item3(item2) {
    var t;
    if (item2[2] == 2) {
        t = 1;
    } else {
        t = 4;
    }
    return [t, item2[0]];
}

function flattenExpression(tokens) {
  var buf1 = []
  var buf2 = []
  var buf3 = []
  
  last = -1;
	for (var item of tokens) {
    //console.log('ITEM:' + item.join(','))
  	if (item[0] != 1) {
    	// this is token or name or digit
      buf1.push(item);
      last = 0;
    } else {
    	// this is operator
      var currOper = item[1]
      var item2 = [currOper, getOperatorPriority(currOper, last), checkOperatorUnity(currOper, last)];
      last = 1
      if (currOper == '(') {
        buf3 = buf3.concat(buf1);
        buf1 = [];
        buf2.push(item2);
      } else if (currOper == ')') {
        buf3 = buf3.concat(buf1);
        buf1 = [];
        oper = buf2.pop();
        while (oper !== null && oper[0] != '(') {
          if (oper[2] == 2) {
              buf3.push(item2_to_item3(oper));
          } else {
              bu
          }
          oper = buf2.pop();
        }
        last = 0
      } else if (buf2.length > 0) {
      	prev_prio = buf2[buf2.length - 1][1];
        curr_prio = item2[1];
        if (curr_prio <= prev_prio) {
          buf3 = buf3.concat(buf1);
          buf1 = [];
          while (buf2.length > 0) {
          	if (buf2[buf2.length - 1][0] == '(') {
            	break;
            }
            oper = buf2.pop();
            buf3.push(item2_to_item3(oper));
          }
        }
        buf2.push(item2);
      } else {
        buf2.push(item2);
      }
    }
    //console.log('    buf1 = ' + buf1);
    //console.log('    buf2 = ' + buf2);
    //console.log('    buf3 = ' + buf3);
  }
  
  buf3 = buf3.concat(buf1);
  buf1 = [];
  
  while (buf2.length > 0) {
  	oper = buf2.pop();
    buf3.push([1, oper[0]]);
  }

  return buf3
}


//var str = '{screen}.width - 300'
//console.log(parseExpression(str))
//var tkns = parseExpression(str);
//console.log(flattenExpression(tkns));
//t1 = parseExpression('a + c * b - a * ( c - d . width ) + (a - b ) * e.height');
//console.log(flattenExpression(t1));
