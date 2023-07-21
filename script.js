/**
 * Date: 16-06-2023
 * Author: Mehedi Hasan Roni
 * Description: Color picker application with huge DOM functionalities
 */

// Globals

let toastContainer = null;
const defaultColor = {
    red:221,
    green:222,
    blue:238,
}

const defultPresetColors = [
    '#AEFA3D',
    '#F6F6A3',
    '#CEA4B8',
    '#42F5C7',
    '#9E4B48',
    '#080553',
    '#0805F6',
    '#8172CC',
    '#215EA0',
    '#EC81D0',
    '#5D738E',
    '#D47B2A',
    '#FAC2A1',
    '#F0DEC0',
    '#1DB7AF',
    '#3A8FA2',
    '#D3EDBF',
    '#AAADAF',

];

let CustomColors = new Array(20);
const copySound = new Audio('copyBtnSound.mp3');
const RandomColorSound = new Audio('Click-Sound-Effect.mp3');




// Onload Handler
window.onload = ()=>{
    main();
    updateToColorCodeDom(defaultColor)
    // Display parent color

    dispalayColorBoxes(document.getElementById('Preset-Colors'), defultPresetColors);

    const CustomColorsString = localStorage.getItem('Custom-Colors');
    if(CustomColorsString){
        CustomColors = JSON.parse(CustomColorsString);
        dispalayColorBoxes(
            document.getElementById('Custom-Colors'),
            CustomColors
        )
    }
}


// main or boot function, this function will take care of getting all the DOM references
function main(){

    // Dom references

    const generateRamdomColorBtn = document.getElementById("RamdomColorBtn");
    const ColorModeHexInp = document.getElementById("input-Hex");
    const colorSliderRed = document.getElementById("color-slider-red");
    const colorSliderGreen = document.getElementById("color-slider-green");
    const colorSliderBlue = document.getElementById("color-slider-blue");
    const CopyToClipboardBtn = document.getElementById("Copy-To-Clipboard")
    const SaveToCustom = document.getElementById("Save-To-Custom")
    const PresetColorPreant = document.getElementById('Preset-Colors')
    const CustomColorsPreant = document.getElementById('Custom-Colors')
    const bgFileInputBtn = document.getElementById('bg-file-input-btn')
    const bgFileInput = document.getElementById('bg-file-input')
    const bgPreview = document.getElementById('bg-preview');
    const bgFileRemoveBtn = document.getElementById('bg-file-remove-btn');
    bgFileRemoveBtn.style.display = 'none';
    const bgController = document.getElementById('bg-controller')
    bgController.style.display = 'none';





//  Event Listener

    generateRamdomColorBtn.addEventListener("click",  HandleGenerateRandomColor);
    ColorModeHexInp.addEventListener("keyup", HandleColorModeHexInput);

    colorSliderRed.addEventListener(
        "change",
    HandleColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue)
    );
    colorSliderGreen.addEventListener(
        "change",
    HandleColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue)
    );
    colorSliderBlue.addEventListener(
        "change",
    HandleColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue)
    );


    CopyToClipboardBtn.addEventListener("click", handleCopyToClipboard);

    PresetColorPreant.addEventListener("click", handlePresetColorPreant);



    SaveToCustom.addEventListener("click", HandleSaveToCustomBtn(CustomColorsPreant, ColorModeHexInp))

    CustomColorsPreant.addEventListener('click', handleCustomColorPreant);

    bgFileInputBtn.addEventListener('click', function(){
        bgFileInput.click()
    });

    bgFileInput.addEventListener('change', handleBgChanageImgFile(bgPreview, bgFileRemoveBtn, bgController))


    bgFileRemoveBtn.addEventListener('click', handleBgControler(bgPreview, bgFileRemoveBtn, bgFileInput, bgController))


document.getElementById('bg-size').addEventListener('change', ChangeBackgroundPreferences);

document.getElementById('bg-repeat').addEventListener('change', ChangeBackgroundPreferences);

document.getElementById('bg-position').addEventListener('change', ChangeBackgroundPreferences);

document.getElementById('bg-attachment').addEventListener('change', ChangeBackgroundPreferences);


};


// Event Handler

function HandleGenerateRandomColor() {
    const color = generateColorDecimal()

    updateToColorCodeDom(color)

 RandomColorSound.play();
 RandomColorSound.volume = 0.5

}


function HandleColorModeHexInput(e){
    const hexColor = e.target.value;

    if(hexColor){
        this.value = hexColor.toUpperCase();
        if(isValidHex(hexColor)){
            const color = hexToDecimalColors(hexColor);
            updateToColorCodeDom(color)
        }
    }
}

function HandleColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue){
   return function (){
        const color = {
             red: parseInt(colorSliderRed.value),
             green: parseInt(colorSliderGreen.value),
             blue: parseInt(colorSliderBlue.value)
         }
         updateToColorCodeDom(color)
     }
}

function  handleCopyToClipboard() {
    const colorModeRedio = document.getElementsByName("color-mode")
    const mode = getCheckedValueFromRadios(colorModeRedio);
    if(mode === null){
        throw new Error('Invalid Radio Input')
    }
    if(toastContainer !== null){
        toastContainer.remove();
        toastContainer = null
    };

    if(mode === 'hex'){
        const hexColor = document.getElementById("input-Hex").value;
        if(hexColor && isValidHex(hexColor)){
            window.navigator.clipboard.writeText(`#${hexColor}`)
            generateToastMassege(`#${hexColor} Copyed`)
            copySound.volume = 0.3;
        copySound.play();
        }else{
            alert("Invaled hex Color code")
        }

    }else{
        const rgbColor = document.getElementById('input-RGB').value;
        if(rgbColor){
            window.navigator.clipboard.writeText(rgbColor)
            generateToastMassege(`${rgbColor} Copyed`)
            copySound.volume = 0.3;
        copySound.play();
        }else{
            alert('Invaled rgb color Code')
        }

    }
};

function  handlePresetColorPreant(e){
    const child = e.target;
    if(child.className === 'color-box'){
        navigator.clipboard.writeText(child.getAttribute('data-color'))
        copySound.volume = 0.3;
        copySound.play();

        if(toastContainer !== null){
            toastContainer.remove();
            toastContainer = null
        };
        generateToastMassege(`${child.getAttribute('data-color')} Copyed`)

    }
}

function HandleSaveToCustomBtn (CustomColorsPreant, inputHex){

    return function(){

        const color = `#${inputHex.value}`;
        if(CustomColors.includes(color)){
            alert("Already saved");
            return
        }
    CustomColors.unshift(color)
    if(CustomColors.length > 19){
        CustomColors = CustomColors.slice(0, 19);
    };
    localStorage.setItem('Custom-Colors', JSON.stringify(CustomColors))
    removeChildren(CustomColorsPreant)
    dispalayColorBoxes(CustomColorsPreant, CustomColors)





    const colorModeRedio = document.getElementsByName("color-mode")
    const mode = getCheckedValueFromRadios(colorModeRedio);
    if(mode === null){
        throw new Error('Invalid Radio Input')
    }
    if(toastContainer !== null){
        toastContainer.remove();
        toastContainer = null
    };

    if(mode === 'hex'){
        const hexColor = document.getElementById("input-Hex").value;
        if(hexColor && isValidHex(hexColor)){
            generateToastMassege(`#${hexColor} Save`)
            copySound.volume = 0.3;
        copySound.play();
        }else{
            alert("Invaled hex Color code not Save")
        }
    }
    }

}


function handleCustomColorPreant(e){
    const child = e.target;
    if(child.className === 'color-box'){
        navigator.clipboard.writeText(child.getAttribute('data-color'))
        copySound.volume = 0.3;
        copySound.play();

        if(toastContainer !== null){
            toastContainer.remove();
            toastContainer = null
        };
        generateToastMassege(`${child.getAttribute('data-color')} Copyed`)

    }
}

// Add bg img file function

function handleBgChanageImgFile(bgPreview, bgFileRemoveBtn, bgController){


 return function(event){
    const file = event.target.files[0];
    const imgUrl = URL.createObjectURL(file);
    bgPreview.style.background = `url(${imgUrl})`;
    document.body.style.background = `url(${imgUrl})`;
    bgFileRemoveBtn.style.display = 'block'
    bgController.style.display = 'block'
 }
};

function handleBgControler(bgPreview, bgFileRemoveBtn, bgFileInput, bgController){
    return function(){
        bgPreview.style.background = 'none';
        bgPreview.style.backgroundColor = '#dddeee';
        document.body.style.background = 'none';
        document.body.style.backgroundColor = '#dddeee';
        bgFileRemoveBtn.style.display = 'none';
        bgFileInput.value = null;
        bgController.style.display = 'none'
        }
}





// DOM Function

function generateToastMassege(mass){
    toastContainer = document.createElement("div");
    toastContainer.innerHTML = mass;
    toastContainer.className = "toast-message toast-message-slide-in"

    toastContainer.addEventListener("click", function(){
        toastContainer.classList.remove("toast-message-slide-in");
        toastContainer.classList.add("toast-message-slide-out");


        toastContainer.addEventListener("animationend", function(){
            toastContainer.remove();
            toastContainer = null;
        })

    });
    document.body.appendChild(toastContainer)
}

/**
 * find the checked elements from a list of radio button
 * @param {Array} nodes;
 * @returns {string || null}
 */
function getCheckedValueFromRadios(nodes){
    let checkedValue = null;
    for(let i = 0; i < nodes.length; i++){
        if(nodes[i].checked){
            checkedValue = nodes[i].value;
            break;
        }
    }
    return checkedValue;
}

/**
 * update dome elements with calcutate color values
 * @param {object} color
 */

function updateToColorCodeDom(color){
    const hexColor = generateHexColor(color);
    const rgbColor = generateRGBColor(color);

    document.getElementById("color-dispalay").style.backgroundColor = `#${hexColor}`;
    document.getElementById("input-Hex").value = hexColor
    document.getElementById("input-RGB").value = rgbColor
    document.getElementById("color-slider-red").value = color.red;
    document.getElementById("color-slider-red-label").innerHTML = color.red;
    document.getElementById("color-slider-green").value = color.green;
    document.getElementById("color-slider-green-label").innerHTML = color.green;
    document.getElementById("color-slider-blue").value = color.blue;
    document.getElementById("color-slider-blue-label").innerHTML = color.blue
}


/**
 * create a div element with class name color-box
 * @param {string} color
 * @returns {object}
 */

function generateColorBox(color){

    let div = document.createElement("div");
    div.className = 'color-box';
    div.style.backgroundColor = color;
    div.setAttribute('data-color', color)

    return div
};

/**
 * this function will create and append new color boxes to its parent
 * @param {object} parent
 * @param {Array} colors
 */

function dispalayColorBoxes(parent, colors){
    colors.forEach((color)=>{
        if(isValidHex(color.slice(1))){
            const colorBox = generateColorBox(color);
            parent.appendChild(colorBox)
        }
    })
}

/**
 * remove all children from parent
 * @param {object} parent
 */

function removeChildren(parent){
    let child = parent.lastElementChild;
    while (child){
        parent.removeChild(child);
        child = parent.lastElementChild;
    }
}


function ChangeBackgroundPreferences(){
    document.body.style.backgroundSize = document.getElementById('bg-size').value;
    document.body.style.backgroundRepeat = document.getElementById('bg-repeat').value;
    document.body.style.backgroundPosition = document.getElementById('bg-position').value;
    document.body.style.backgroundAttachment = document.getElementById('bg-attachment').value;
}


// Ulits

/**
 * generate and return an object of three color decimal value
 * @param {object}}
 * @returns
 */

function generateColorDecimal(){
    const red = Math.floor(Math.random() * 255);
    const green = Math.floor(Math.random() * 255);
    const blue = Math.floor(Math.random() * 255);

    return{
        red,
        green,
        blue,
    };
}



/**
 * take a color object of three decimal values and return a hexadecimal color code
 * @param {object} color
 * @returns {string}
 */

function generateHexColor({red, green, blue}){
    const getTwoCode = (value)=>{
        const hex = value.toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
    };

    return `${getTwoCode(red)}${getTwoCode(green)}${getTwoCode(blue)}`.toUpperCase();
}


/**
 *take a color object of three decimal values and return a rgb color code
 * @param {object} color
 * @returns {string}
 */
function generateRGBColor({red, green, blue}){
    return `rgb(${red},${green},${blue})`
}


/**
 * convert hex color to decimal colors object
 * @param {string} hex
 * @returns {object}
 */

function hexToDecimalColors(hex){
    const red =parseInt(hex.slice(0, 2), 16);
    const green = parseInt(hex.slice(2, 4), 16);
    const blue = parseInt(hex.slice(4, 6), 16);

    return {
        red,
        green,
        blue
    }

}


/**
 * validata hex color code
 * @param {string} color;
 * @returns {boolean}
 */

function isValidHex(color){
    if(color.length !== 6) return false;
    return /^[0-9A-Fa-f]{6}$/i.test(color)
}
