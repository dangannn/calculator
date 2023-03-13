'use strict';
let numb1 = '';
let lastKey = '';
const operators = ['*', '/', '-', '+'];
const beforeBracket = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '(', ')'];
let out = document.getElementById('out');
let display = document.getElementById('display');
const url = './index.php';
let btn = document.querySelectorAll('.calculator__btn');

function ajax(data, url) {
    let param = `data=${data}`;
    let request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(param);
    request.addEventListener('readystatechange', () => {
        if (request.readyState === 4 && request.status === 200) {
            display.textContent = request.responseText;
            out.textContent = '';
        }
    })
}

for (let i = 0; i < btn.length; i++) {
    if (btn[i].textContent === 'AC') {
        btn[i].addEventListener('click', (event) => {
            numb1 = '';
            out.textContent = '0';
            display.textContent = '';
        });
    } else if (btn[i].textContent === '=') {
        btn[i].addEventListener('click', (event) => {
            let openBracketCounter = 0;
            let closeBracketCounter = 0;
            for (let i = 0; i < numb1.length; i++) {
                if (numb1[i] === '(') {
                    openBracketCounter += 1
                }
                if (numb1[i] === ')') {
                    closeBracketCounter += 1
                }
            }
            if (closeBracketCounter === openBracketCounter) {
                numb1 = '';
                console.log(out.textContent);
                ajax(out.textContent, url);
                openBracketCounter = 0;
                closeBracketCounter = 0;
            }
            numb1 = '';
            lastKey = '';
            console.log(out.textContent);
            ajax(out.textContent, url);
        });
    } else {
        btn[i].addEventListener('click', (event) => {
            const key = event.target.textContent;
            // если последний и новый символы - операторы, поменять
            if (out.textContent.length !== 0 && operators.includes(lastKey) && operators.includes(key)) {
                numb1 = numb1.slice(0, numb1.length - 1) + key;
                out.textContent = numb1;
                lastKey = key;
            }
            // обработка скобок
            else if (key === '(') {
                if (out.textContent === '0') {
                    numb1 += key;
                    out.textContent = numb1;
                    lastKey = key;
                } else if (lastKey === '(') {
                    numb1 += key;
                    out.textContent = numb1;
                    lastKey = key;
                } else if (beforeBracket.includes(lastKey)) {
                    console.log(lastKey);
                    numb1 += '*' + key;
                    out.textContent = numb1;
                    lastKey = key;
                } else if (operators.includes(lastKey)) {
                    numb1 += key;
                    out.textContent = numb1;
                    lastKey = key;
                }
            } else if (key === ')') {
                if (lastKey === '(') {
                    lastKey = numb1[numb1.length - 2];
                    console.log(lastKey);
                    numb1 = numb1.slice(0, numb1.length - 1);
                    out.textContent = numb1;
                } else {
                    let bracketCounter = 0;
                    for (let i = 0; i < numb1.length; i++) {
                        if (numb1[i] === '(') {
                            bracketCounter += 1;
                        } else if (numb1[i] === ')') {
                            bracketCounter -= 1;
                        }
                    }
                    if (bracketCounter < 1 || operators.includes(lastKey)) {
                        bracketCounter = 0;
                    } else {
                        numb1 += key;
                        out.textContent = numb1;
                        lastKey = key;
                        bracketCounter = 0;
                    }
                }
            } else {
                // добавить оператор, если дисплей не пустой
                if (display.textContent !== '' && operators.includes(key)) {
                    numb1 += display.textContent + key;
                    out.textContent = numb1;
                    lastKey = key;
                    display.textContent = '';
                }
                // оператор если строка пуста
                else if ((key === '*' || key === '/' || key === '.') && (numb1.length === 0)) {

                }
                // число сразу после закрывающейся скобки
                else if (lastKey === ')' && !operators.includes(key)) {
                    numb1 += '*' + key;
                    out.textContent = numb1;
                    lastKey = key;
                    display.textContent = '';
                }
                // число сразу после открывающейся скобки
                else if (lastKey === '(' && operators.includes(key)){
                }
                // обычное число
                else {
                    numb1 += key;
                    out.textContent = numb1;
                    lastKey = key;
                    display.textContent = '';
                }
            }
        });
    }

}

