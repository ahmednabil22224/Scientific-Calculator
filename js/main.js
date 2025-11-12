const operators = "+-*/%";
const trigArr = ["sin", "cos", "tan"];
let isDegree = true;
let input = document.querySelector("#input input");
const output = document.querySelector("#output input");
let bttns = document.getElementById("bttns");
const max = parseInt(input.getAttribute("maxlength"));

// ==========================================================================
// ==========================Buttons Listener================================
bttns.addEventListener("click", function (e) {
  const bttn = e.target.closest("button");
  if (!bttn) return;

  const start = input.selectionStart;

  const bttnValue = bttn.value;

  handleInputOutputState(bttnValue);

  if (
    input.value === "Can't divid by zero" ||
    input.value === "Result is undefined"
  ) {
    input.value = "";
  }

  // ---------------------------Remove Button X--------------------------------
  if (bttnValue === "X") handleRemoveKeyBttn(start);

  // -----------------------------Clear Button-----------------------------------
  if (bttnValue === "AC") clearBttn();

  //-------------------------Stop At Specific Length--------------------------
  if (input.value.length >= max && bttn.value !== "=") {
    input.scrollLeft = input.scrollWidth;
    return;
  }

  // ------------------Add, Min, Divid, Multiply and Modulus Operators Buttons--------
  if (/[%/*+-]/.test(bttnValue)) handleOperators(bttnValue, start);

  // ------------------------------Dot Button--------------------------------------
  if (bttnValue === ".") handleDotKeyBttn(start);

  // ----------------------Zero Button && Double Zero Button------------------------
  if (/^00$/.test(bttnValue)) zeroBttns(start);

  // --------------------------Num Buttons 0 to 9---------------------------------
  // if (/[1-9]/.test(bttnValue)) numBttns(bttnValue);
  if (/^[0-9]$/.test(bttnValue)) handleNums(bttnValue, start);

  // --------------------------Bracket Right ( Button---------------------------------
  if (bttnValue === "(") handleRightBracket(start);

  // --------------------------Bracket Left ( Button---------------------------------
  if (bttnValue === ")") handleLeftBracket(start);

  // ----------------------------Trig Sin, Cos, Tan Buttons-------------------------
  if (bttnValue === "s") handleTrigKeyBttn("sin(", start);
  if (bttnValue === "c") handleTrigKeyBttn("cos(", start);
  if (bttnValue === "t") handleTrigKeyBttn("tan(", start);
  if (bttnValue === "S") handleTrigKeyBttn("sin\u207B\u00B9(", start);
  if (bttnValue === "C") handleTrigKeyBttn("cos\u207B\u00B9(", start);
  if (bttnValue === "T") handleTrigKeyBttn("tan\u207B\u00B9(", start);

  // -------------------------Convert Deg & Rad Buttons-------------------------
  if (bttnValue === "deg") convertDegRadBttn(bttnValue);
  if (bttnValue === "rad") convertDegRadBttn(bttnValue);

  // --------------------------Factorial Button---------------------------
  if (bttnValue === "!") handleFactorialKeyBttn(start);

  // ---------------------------Power Button------------------------------
  if (bttnValue === "^") handlePowerKeyBttn(start);

  //------------------------Power Base Ten Button------------------------
  if (bttnValue === "10^") powerBaseTenBttn(bttnValue);

  // ------------------------Power Square Button---------------------------
  if (bttnValue === "q") handlePowerSqKeyBttn(start);

  // -----------------------------Root Button------------------------------
  if (bttnValue === "√") handleRootKeyBttn(start);

  // -----------------------------PI E Button------------------------------
  if (bttnValue === "π") handlePIEKeyBttn(bttnValue, start);
  if (bttnValue === "e") handlePIEKeyBttn(bttnValue, start);

  // -----------------------------EXP Button-------------------------------
  if (bttnValue === "E") handleExpKeyBttn(start);

  // ----------------------------Log Button------------------------------
  if (bttnValue === "L") handleLogLnKeyBttn("log(", start);
  if (bttnValue === "l") handleLogLnKeyBttn("ln(", start);

  // ------------------------------equal Button-----------------------------
  if (bttnValue === "=") handleResult(bttnValue);

  input.focus();
  input.scrollLeft = input.scrollWidth;
  handleOutputValue(bttnValue);
});

// -----------------------Handle Convert Degree Or Rad-------------------
function convertDegRadBttn(bttnValue) {
  if (bttnValue === "deg") {
    isDegree = true;
    document.querySelector("button[value= deg]").style.color =
      "rgb(238, 90, 37)";
    document.querySelector("button[value= rad]").style.color = "#000";
  } else {
    isDegree = false;
    document.querySelector("button[value= deg]").style.color = "#000";
    document.querySelector("button[value= rad]").style.color =
      "rgb(238, 90, 37)";
  }
  output.value = handleFinalInputText(input.value);
}

// ---------------------Change Input && Output State---------------------
function changeInOutputState(bttnValue) {
  input.style.fontSize =
    bttnValue === "=" || bttnValue === "Enter" ? "1.2rem" : "1.8rem";
  input.style.color =
    bttnValue === "=" || bttnValue === "Enter" ? "#444" : "black";
  output.style.fontSize =
    bttnValue === "=" || bttnValue === "Enter" ? "1.8rem" : "1.2rem";
  output.style.color =
    bttnValue === "=" || bttnValue === "Enter" ? "black" : "#444";
}

// ----------------Handle Input & Output Values After Result-------------
function handleInOutputValuesAfterResult(bttnValue) {
  if (output.style.color === "black") {
    changeInOutputState(bttnValue);
    clearBttn();
  }
}

// ----------------Show & hide Trig Buttons sin-1 cos-1 tan-1 -----------
document.querySelector("button[value=inv]").onclick = (e) => {
  document
    .querySelectorAll(".t-b")
    .forEach((bttn) => bttn.classList.toggle("inv-hide"));
  if (e.target.style.color === "rgb(238, 90, 37)") {
    e.target.style.color = "#000";
  } else {
    e.target.style.color = "rgb(238, 90, 37)";
  }
};

// =====================================================================
// ====================Function To Handle Power=========================
function handlePower(input) {
  return input.replaceAll("^", "**");
}

// ====================Function To Handle Square Power==================
// ------------------------Square Power Calculation---------------------
function sq(num) {
  return num ** 2;
}
function handleSquarePower(input) {
  let store = [],
    output = "";
  input = input.replaceAll(/(\d+(\.)?(\d+)?)\u00B2/g, `sq($1)`);
  for (let i = input.length - 1; i >= 0; i--) {
    if (input[i] === ")") {
      if (input[i + 1] === "\u00B2") {
        store.push(")x");
        output = ")" + output;
      } else store.push(")");
    } else if (input[i] === "(") {
      if (store.at(-1) === ")x") {
        if (
          trigArr.includes(input.slice(i - 3, i)) ||
          input.slice(i - 3, i) === "log" ||
          input.slice(i - 3, i) === "exp"
        ) {
          output = `sq(` + input.slice(i - 3, i + 1) + output;
          i -= 4;
        } else if (
          trigArr.includes(input.slice(i - 5, i - 2)) &&
          input.at(i - 1) === "\u00B9"
        ) {
          output = `sq(` + input.slice(i - 5, i + 1) + output;
          i -= 6;
        } else if (input.slice(i - 2, i) === "ln") {
          output = `sq(` + input.slice(i - 2, i + 1) + output;
          i -= 3;
        } else {
          output = `sq(` + output;
        }
      }

      store.pop();
    }

    if (input[i] && input[i] !== "\u00B2") output = input[i] + output;
  }
  return output;
}

// ====================Function To Handle Root==========================
function handleRoot(input) {
  let store = [],
    output = "";

  while (input.includes("√√")) {
    input = input.replaceAll(/√√/g, "Math.sqrt(√");
  }
  input = input.replaceAll(/√(\d+(\.)?(\d+)?)/g, `Math.sqrt($1)`);
  input = input.replaceAll(/√\(/g, "Math.sqrt(");

  for (let i = 0; i < input.length; i++) {
    if (
      input[i] === "√" &&
      (trigArr.includes(input.slice(i + 1, i + 4)) ||
        input.slice(i + 1, i + 4) === "exp")
    ) {
      output += "Math.sqrt(";
      store.push("√(");
      continue;
    }
    if (input[i] === "(") {
      store.push("(");
    } else if (input[i] === ")") {
      store.pop();
      if (store.at(-1) === "√(") {
        store.pop();
        output += ")";
      }
    }
    output += input[i];
  }
  return output;
}

// ====================Function To Handle PI============================
function handlePI(input) {
  return input.replaceAll("π", "Math.PI");
}

// =======================Function To Handle E===========================
function handleE(input) {
  return input.replaceAll(/e(?!x)/g, "Math.E");
}

// ======================Function To Handle EXP==========================
function handleEXP(input) {
  return input.replaceAll("exp", `Math.exp`);
}

// ====================Function To Handle Log============================
function handleLog(input) {
  return input.replaceAll(/log/g, "Math.log10");
}

// ====================Function To Handle Ln=============================
function handleLn(input) {
  return input.replaceAll(/ln/g, "Math.log");
}

// ===================Function To Handle Factorial========================
// ------------------------Factorial Calculation--------------------------
function f(num) {
  if (num < 0 || !Number.isInteger(num)) return Number.NaN();

  if (num === 0 || num === 1) return 1;
  else return num * f(num - 1);
}
function handleFactorial(input) {
  let store = [],
    output = "";

  input = input.replaceAll(/((√)?\d+(\.)?(\d+)?(\u00B2)?)!/g, `f($1)`);
  input = input.replaceAll(/(e|π)!/g, `f($1)`);

  for (let i = input.length - 1; i >= 0; i--) {
    if (input[i] === "!" && input[i - 1] === ")") {
      continue;
    } else if (input[i] === ")") {
      if (input[i + 1] === "!") {
        store.push(")!");
        output = "))" + output;
      } else {
        store.push(")");
        output = ")" + output;
      }
    } else if (input[i] === "(") {
      if (store.at(-1) === ")") output = "(" + output;
      else if (store.at(-1) === ")!") {
        if (input[i - 1] === "f") {
          output = "f(" + input.slice(i - 1, i + 1) + output;
          i = i - 1;
        } else if (
          trigArr.includes(input.slice(i - 3, i)) ||
          input.slice(i - 3, i) === "exp"
        ) {
          output = "f(" + input.slice(i - 3, i + 1) + output;
          i = i - 3;
        } else if (input.slice(i - 2, i) === "ln") {
          output = "f(" + input.slice(i - 2, i + 1) + output;
          i = i - 2;
        } else if (
          trigArr.includes(input.slice(i - 5, i - 2)) &&
          input.at(i - 1) === `\u00B9`
        ) {
          output = "f(" + input.slice(i - 5, i + 1) + output;
          i = i - 5;
        } else {
          output = "f((" + output;
        }
      } else {
        output = input[i] + output;
      }
      store.pop();
    } else {
      output = input[i] + output;
    }
  }

  while (input.includes("!")) {
    store = [];
    input = output;
    output = "";
    for (let i = input.length - 1; i >= 0; i--) {
      if (input[i] === "!" && input[i - 1] === ")") {
        store.push("!");
        output = ")" + output;
        continue;
      } else if (input[i] === ")") {
        store.push(")");
      } else if (input[i] === "(") {
        store.pop();
      } else if (input[i] === "f" && store[0] === "!") {
        store = [];
        output = "f(f" + output;
        continue;
      }
      output = input[i] + output;
    }
  }

  return output;
}

// =================Function To Handle Trig Functions=====================
function handleTrig(input) {
  let store = [],
    output = "";
  if (!isDegree) {
    input = input.replaceAll("sin(", "Math.sin(");
    input = input.replaceAll("cos(", "Math.cos(");
    input = input.replaceAll("tan(", "Math.tan(");
    input = input.replaceAll("sin\u207B\u00B9(", "Math.asin(");
    input = input.replaceAll("cos\u207B\u00B9(", "Math.acos(");
    input = input.replaceAll("tan\u207B\u00B9(", "Math.atan(");
    console.log(input);
    return input;
  } else {
    input = input.replaceAll("sin(", "Math.sin(Math.PI/180*(");
    input = input.replaceAll("cos(", "Math.cos(Math.PI/180*(");
    input = input.replaceAll("tan(", "Math.tan(Math.PI/180*(");

    for (let i in input) {
      if (input[i] === "(") {
        if (trigArr.includes(`${input.slice(i - 3, +i)}`)) store.push("trig(");
        else store.push("(");
      } else if (input[i] === ")") {
        store.pop();
        if (store.at(-1) === "trig(") {
          output += input[i];
          store.pop();
        }
      }
      output += input[i];
    }

    output = output.replaceAll("sin\u207B\u00B9(", "180/Math.PI*Math.asin(");
    output = output.replaceAll("cos\u207B\u00B9(", "180/Math.PI*Math.acos(");
    output = output.replaceAll("tan\u207B\u00B9(", "180/Math.PI*Math.atan(");
    return output;
  }
}

// =======================================================================
function handleFinalInputText(expert) {
  expert = handleFactorial(expert);
  expert = handlePI(expert);
  expert = handleRoot(expert);
  expert = handleE(expert);
  expert = handleSquarePower(expert);
  expert = handleEXP(expert);
  expert = handlePower(expert);
  expert = handleLog(expert);
  expert = handleLn(expert);
  expert = handleTrig(expert);

  expert = expert.replaceAll(/([)EI0-9.])(?=\(|\M|f)/g, "$1*");
  expert = expert.replaceAll(/([\u00B2)IE])(?=\d)/g, "$1*");
  expert = expert.replaceAll("log10*(", "log10(");

  // console.log(expert);
  let store = [],
    evaluate = "";

  for (let i of expert) {
    if (i === "(") store.push(i);
    else if (i === ")") store.pop();
  }

  evaluate = expert;
  for (let i of store) evaluate += ")";

  try {
    return eval(evaluate);
  } catch {
    output.value = "Wrong Expression";
  }
}
// =======================================================================
// ----------------------Close App----------------------
document.getElementById("close").addEventListener("click", () => {
  window.close();
});

// -----------------Show & hide All Buttons----------------------
document.getElementById("show-all-bttns").addEventListener("click", () => {
  document.getElementById("bttns").classList.toggle("show");
});

// ==========================================================================
// ==========================================================================
// =========================== Keyboard Listener ============================
input.addEventListener("keydown", (e) => {
  e.preventDefault();

  const start = input.selectionStart;

  handleInputOutputState(e.key);

  if (e.key === "Backspace") handleRemoveKeyBttn(start);

  if (input.value.length >= max && e.key !== "=" && e.key !== "Enter") {
    input.scrollLeft = input.scrollWidth;
    input.setSelectionRange(start + 1, start + 1);
    return;
  }

  // ------------------Handle Trig, Log, Exp, Ln, √, π Keys----------------
  switch (e.key) {
    case "s":
      handleTrigKeyBttn("sin(", start);
      break;
    case "c":
      handleTrigKeyBttn("cos(", start);
      break;
    case "t":
      handleTrigKeyBttn("tan(", start);
      break;
    case "S":
      handleTrigKeyBttn("sin\u207B\u00B9(", start);
      break;
    case "C":
      handleTrigKeyBttn("cos\u207B\u00B9(", start);
      break;
    case "T":
      handleTrigKeyBttn("tan\u207B\u00B9(", start);
      break;
    case "l":
      handleLogLnKeyBttn("ln(", start);
      break;
    case "L":
      handleLogLnKeyBttn("log(", start);
      break;
    case "r":
      handleRootKeyBttn(start);
      break;
    case "e":
      handlePIEKeyBttn("e", start);
      break;
    case "E":
      handleExpKeyBttn(start);
      break;
    case "p":
      handlePIEKeyBttn("π", start);
      break;
    case "q":
      handlePowerSqKeyBttn(start);
      break;
    case "(":
      handleRightBracket(start);
      break;
    case "ArrowRight":
      input.setSelectionRange(start + 1, start + 1);
      break;
    case "ArrowLeft":
      if (start) input.setSelectionRange(start - 1, start - 1);
      break;
  }

  // --------------------------Handle Nums Keys----------------------------
  if (/[0-9]/.test(e.key)) handleNums(e.key, start);

  // --------------------------Handle Dot Key------------------------------
  if (e.key === ".") handleDotKeyBttn(start);

  // -----------------------Handle Operators Keys--------------------------
  if (/[*/%+-]/.test(e.key)) handleOperators(e.key, start);

  // ---------------------Handle Left Bracket ) Key------------------------
  if (e.key === ")") handleLeftBracket(start);

  // --------------------------Handle Factorial Key------------------------
  if (e.key === "!") handleFactorialKeyBttn(start);

  // ---------------------------Handle Power Key---------------------------
  if (e.key === "^") handlePowerKeyBttn(start);

  // --------------------------Handle Equal Key----------------------------
  if (e.key === "=" || e.key === "Enter") handleResult(e.key);

  handleOutputValue(e.key);
  input.scrollLeft = input.scrollWidth;
});

// **********************************************************************
// **********************************************************************
// -------------------------Handle Input Output State--------------------
function handleInputOutputState(key) {
  if ((key.length === 1 && /[sScCtTpreElL().0-9]/.test(key)) || key == "00") {
    handleInOutputValuesAfterResult(key);
    input.setSelectionRange(output.value.length + 1, output.value.length + 1);
  }

  if (key.length === 1 && /[q!^%/*+-]/.test(key)) {
    if (output.style.color === "black") {
      changeInOutputState(key);
      input.value = output.value;
      input.setSelectionRange(output.value.length + 1, output.value.length + 1);
    }
  }
}

// ---------------------------Handle Clear Button -----------------------
function clearBttn() {
  input.value = "";
  output.value = "";
}

// ------------------------Handle Remove Backspace-----------------------

function handleRemoveKeyBttn(start) {
  const mathExp = ["sin(", "cos(", "tan(", "exp(", "log("];

  if (start === 0) return;
  if (mathExp.includes(input.value.slice(start - 4, start))) {
    input.value = input.value.replace(input.value.slice(start - 4, start), "");
    input.setSelectionRange(start - 4, start - 4);
  } else if (
    trigArr.includes(input.value.slice(start - 6, start - 3)) &&
    input.value.at(start - 2) === `\u00B9`
  ) {
    input.value = input.value.replace(input.value.slice(start - 6, start), "");
    input.setSelectionRange(start - 6, start - 6);
  } else if (input.value.slice(start - 3, start) === "ln(") {
    input.value = input.value.replace(input.value.slice(start - 3, start), "");
    input.setSelectionRange(start - 3, start - 3);
  } else {
    input.value = input.value.slice(0, start - 1) + input.value.slice(start);
    input.setSelectionRange(start - 1, start - 1);
  }

  if (output.style.color === "black") changeInOutputState();
}

// ------------------------Handle 00 Buttons----------------||
function zeroBttns(start) {
  if (input.value === "" || input.value === "0") input.value = "0";
  else if (
    /[\u00B2()√^!πe%/*+-]/.test(input.value.at(start - 1)) ||
    start === 0
  ) {
    input.value = input.value.slice(0, start) + "0" + input.value.slice(start);
    input.setSelectionRange(start + 1, start + 1);
  } else if (
    input.value.at(start - 1) === "0" &&
    /[(√^%/*+-]/.test(input.value.at(-2))
  )
    input.setSelectionRange(start, start);
  else {
    input.value = input.value.slice(0, start) + "00" + input.value.slice(start);
    input.setSelectionRange(start + 2, start + 2);
  }
}

// -----------------------Handle Buttons And Keys------------------------
function handleNums(key, start) {
  if (
    (/[(*/%+-]/.test(input.value.at(start - 2)) || input.value.length === 1) &&
    /[0]/.test(input.value.at(start - 1))
  ) {
    input.value =
      input.value.slice(0, start - 1) + key + input.value.slice(start);
    input.setSelectionRange(start, start);
  } else {
    input.value = input.value.slice(0, start) + key + input.value.slice(start);
    input.setSelectionRange(start + 1, start + 1);
  }
}

function handleDotKeyBttn(start) {
  let str = "";
  for (let i = start; i < input.value.length; i++) {
    if (input.value[i].match(/[*/%()^+-]/g)) break;
    str += input.value[i];
  }
  for (let i = start - 1; i >= 0; i--) {
    if (input.value[i].match(/[*/%()^+-]/g)) break;
    str += input.value[i];
  }

  if (str.includes(".")) return;

  if (/[eπ!()√*/%+-]/.test(input.value.at(start - 1)) || start === 0) {
    input.value = input.value.slice(0, start) + "0." + input.value.slice(start);
    input.setSelectionRange(start + 2, start + 2);
  } else {
    input.value = input.value.slice(0, start) + "." + input.value.slice(start);
    input.setSelectionRange(start + 1, start + 1);
  }
}

function handleOperators(key, start) {
  if (start === 0 || /[(√]/.test(input.value.at(start - 1))) return;
  else if (
    (input.value.at(start - 1) === "^" && /[%/*+]/.test(key)) ||
    /[%/*+-.]/.test(input.value.at(start - 1))
  ) {
    input.value =
      input.value.slice(0, start - 1) + key + input.value.slice(start);
    input.setSelectionRange(start, start);
  } else {
    input.value = input.value.slice(0, start) + key + input.value.slice(start);
    input.setSelectionRange(start + 1, start + 1);
  }
}

// --Is Balanced Brackets--
function isBalancedBracket() {
  const rightBrLen = input.value.match(/\(/g);
  const leftBrLen = input.value.match(/\)/g);

  if (leftBrLen?.length === rightBrLen?.length) return false;
  return true;
}

function handleRightBracket(start) {
  input.value = input.value.slice(0, start) + "(" + input.value.slice(start);
  input.setSelectionRange(start + 1, start + 1);
}

function handleLeftBracket(start) {
  if (!isBalancedBracket()) return;

  if (/[(√^*/%+-]/.test(input.value.at(start - 1)) || start === 0) {
    return;
  } else {
    input.value = input.value.slice(0, start) + ")" + input.value.slice(start);
    input.setSelectionRange(start + 1, start + 1);
  }
}

function handleTrigKeyBttn(key, start) {
  input.value = input.value.slice(0, start) + key + input.value.slice(start);
  if (key.length > 5) {
    input.setSelectionRange(start + 6, start + 6);
  } else {
    input.setSelectionRange(start + 4, start + 4);
  }
}

function handleRootKeyBttn(start) {
  input.value = input.value.slice(0, start) + "√" + input.value.slice(start);
  input.setSelectionRange(start + 1, start + 1);
}

function handlePowerKeyBttn(start) {
  if (/[(^√\u00B2(*/%+-]/.test(input.value.at(start - 1)) || start === 0)
    return;
  else {
    input.value = input.value.slice(0, start) + "^" + input.value.slice(start);
    input.setSelectionRange(start + 1, start + 1);
  }
}

function handlePowerSqKeyBttn(start) {
  input.value =
    input.value.slice(0, start) + "\u00B2" + input.value.slice(start);
  input.setSelectionRange(start + 1, start + 1);
}

function powerBaseTenBttn(bttnValue) {
  handleInOutputValuesAfterResult(bttnValue);

  if (input.value === "" || input.value === "0") input.value = "10^";
  else if (input.value.at(-1) === "0" && /[(%/*+-]/.test(input.value.at(-2))) {
    input.value = input.value.slice(0, -1) + "10^";
  } else if (/[0-9]/.test(input.value.at(-1))) input.value += `*10^`;
  else input.value += "10^";
}

function handleFactorialKeyBttn(start) {
  if (/[(√*/%+-]/.test(input.value.at(start - 1)) || start === 0) return;
  else if (
    /[0-9]/.test(input.value.at(start - 1)) &&
    /[0-9]/.test(input.value.at(start))
  ) {
    input.value = input.value.slice(0, start) + "!*" + input.value.slice(start);
    input.setSelectionRange(start + 1, start + 1);
  } else {
    input.value = input.value.slice(0, start) + "!" + input.value.slice(start);
    input.setSelectionRange(start + 1, start + 1);
  }
}

function handlePIEKeyBttn(key, start) {
  input.value = input.value.slice(0, start) + key + input.value.slice(start);
  input.setSelectionRange(start + 1, start + 1);
}

function handleExpKeyBttn(start) {
  input.value = input.value.slice(0, start) + "exp(" + input.value.slice(start);
  input.setSelectionRange(start + 4, start + 4);
}

function handleLogLnKeyBttn(key, start) {
  5;
  input.value = input.value.slice(0, start) + key + input.value.slice(start);
  if (key === "log(") input.setSelectionRange(start + 4, start + 4);
  else input.setSelectionRange(start + 3, start + 3);
}

function handleResult(bttnValue) {
  if (input.value === "" || handleFinalInputText(input.value) === undefined)
    return;
  else if (handleFinalInputText(input.value) === Infinity) {
    output.value = "Can't divid by zero";
  } else if (
    Number.isNaN(handleFinalInputText(input.value)) ||
    handleFinalInputText(input.value) === -Infinity
  ) {
    output.value = "Result is undefined";
  } else {
    changeInOutputState(bttnValue);
  }
}

// --------------------------Handle Output Value-------------------------
function handleOutputValue(key) {
  if (
    key === "(" ||
    handleFinalInputText(input.value) === Infinity ||
    Number.isNaN(handleFinalInputText(input.value))
  ) {
    output.value = "";
  } else if (input.value.slice(-2) === "^-") {
    output.value = handleFinalInputText(input.value.slice(0, -2)) || "";
  } else if (
    /[*/%+-]/.test(input.value.at(-1)) ||
    /[\^*/%+-]/.test(input.value.at(-1))
  ) {
    output.value = handleFinalInputText(input.value.slice(0, -1)) || "";
  } else {
    output.value = handleFinalInputText(input.value) || "";
  }
}
