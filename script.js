/*TODO: 
    range meter for grid size
    color fill
    undo?
*/

//default value
let rainbowColor = "hsl(0,100%,50%)"

function updateRainbowColor(hsl) {
    const PERCENT_CHANGE = 2

    //split the string hsl input into an array hsl = [hue,saturation,lightness]
    let sep = hsl.indexOf(",") > -1 ? "," : " ";
    hsl = hsl.substr(4).split(")")[0].split(sep);

    //increment the hue, and mod it by 360 since that is the max hue value
    return "hsl(" + (parseInt(hsl[0]) + PERCENT_CHANGE) % 360 + "," + hsl[1] + "," + hsl[2] + ")";
    
}

const colorPicker = document.querySelector('#colorPicker')

const grid = document.querySelector(".grid")
const GRID_SIZE = 16
const GRID_WIDTH = grid.clientWidth - parseFloat(getComputedStyle(grid, null).getPropertyValue('padding'))*2
for(let i = 0; i < GRID_SIZE; i++){
    for(let j = 0; j < GRID_SIZE; j++){
        const pixel = document.createElement('div')
        pixel.classList.add('pixel')
        pixel.style.width = (GRID_WIDTH / GRID_SIZE) + "px"
        pixel.style.height = (GRID_WIDTH / GRID_SIZE) + "px"
        pixel.style.backgroundColor = "#ffffff"
        grid.appendChild(pixel)

        //mouse1 is already being held when it enters the pixel
        pixel.addEventListener('mouseover', e => {
            if(e.buttons === 1) {
                drawingLogic(e)
            }
        })

        pixel.addEventListener('mousedown', e => {
            drawingLogic(e)

            if(isEyedropperActive()){
                colorPicker.value = RGBtoHex(e.target.style.backgroundColor)
                activeColorButton = colorButtons[0]
                activeColorButton.classList.add('btn-active')
                activeDrawButton = drawButtons[0]
                activeDrawButton.classList.add('btn-active')
                eyedropper.classList.remove('btn-active')
            }
        })
        
        //disables dragging the pixel element bug
        pixel.addEventListener('dragstart', e => {
            e.preventDefault()
        })
    }
}



//[btnDraw, btnEraser, btnDarken, btnLighten]
const drawButtons = document.querySelectorAll('.drawButtons button')

//initialize active button
let activeDrawButton = drawButtons[0]
activeDrawButton.classList.add('btn-active')

//add highlight class to draw buttons group
drawButtons.forEach( button => {
    button.addEventListener('mousedown', event => {
        if(isEyedropperActive()){
            //if eyedropper is active, active buttons are null, so reinitialize them to the default
            resetBtnsToDefault()
        }

        activeDrawButton.classList.remove('btn-active')

        //set new active button
        activeDrawButton = event.target
        activeDrawButton.classList.add('btn-active')
    })
})

function drawingLogic(e){
    //pen
    if(activeDrawButton == drawButtons[0]) {
        //color picker
        if(activeColorButton == colorButtons[0]) {
            e.target.style.backgroundColor = colorPicker.value
        }
        //rainbow colors
        else {
            e.target.style.backgroundColor = rainbowColor
            rainbowColor = updateRainbowColor(rainbowColor)
        }
    } 
    //eraser
    else if (activeDrawButton == drawButtons[1]){
        e.target.style.backgroundColor = "#ffffff"
    } 
    //darken
    else if (activeDrawButton == drawButtons[2]){
        e.target.style.backgroundColor = HSLDarken(RGBToHSL(e.target.style.backgroundColor))
    } 
    //lighten
    else if (activeDrawButton == drawButtons[3]){
        e.target.style.backgroundColor = HSLLighten(RGBToHSL(e.target.style.backgroundColor))
    }
}


//[btnColor, btnRainbow]
const colorButtons = document.querySelectorAll(".colorButtons button")
let activeColorButton = colorButtons[0]
activeColorButton.classList.add("btn-active")

colorButtons.forEach( button => {
    button.addEventListener('mousedown', event => {
        if(isEyedropperActive()){
            //if eyedropper is active, active buttons are null, so reinitialize them to the default
            resetBtnsToDefault()
        }
        activeColorButton.classList.remove('btn-active')

        //because the color picker input is clickable, .btn-active will highlight it instead of the button it's in.
        //thus we add the class to its parent, which is the actual button
        if(event.target.localName === "input"){
            event.target.parentElement.classList.add('btn-active')
            activeColorButton = event.target.parentElement
        } else {
            activeColorButton = event.target
            activeColorButton.classList.add('btn-active')
        }

        //when a color is selected/changed, change the active draw button to the pencil for better UX
        activeDrawButton.classList.remove('btn-active')
        activeDrawButton = drawButtons[0]
        activeDrawButton.classList.add('btn-active')
    })
})

//reset button - reset all pixels to white, reset buttons and colors to initial values
const pixels = document.querySelectorAll('.pixel')
const btnReset = document.querySelector('#btnReset')
btnReset.addEventListener('click', e => {
    pixels.forEach(pixel => {
        pixel.style.backgroundColor = "#ffffff" 
    });

    if(isEyedropperActive()){
        //if eyedropper is active, active buttons are null, so reinitialize them to the default
        resetBtnsToDefault()
    }
    
    activeColorButton.classList.remove('btn-active')
    activeColorButton = colorButtons[0]
    activeColorButton.classList.add('btn-active')

    activeDrawButton.classList.remove('btn-active')
    activeDrawButton = drawButtons[0]
    activeDrawButton.classList.add('btn-active')
    colorPicker.value = "#000000"
    rainbowColor = "hsl(0,100%,50%)"
    eyedropper.classList.remove('btn-active')
})


const eyedropper = document.querySelector('#eyedropper')
eyedropper.addEventListener('click', e => {
    e.target.classList.add('btn-active')

    //if the eyedropper button is clicked while it's already selected, do not try to access active buttons because they're set to null
    if(activeColorButton !== null || activeDrawButton !== null){
        activeColorButton.classList.remove('btn-active')
        activeDrawButton.classList.remove('btn-active')
        activeColorButton = null
        activeDrawButton = null
    }

})

const isEyedropperActive = () => eyedropper.classList.contains("btn-active")
function resetBtnsToDefault() {
    activeColorButton = colorButtons[0]
    activeColorButton.classList.add('btn-active')
    activeDrawButton = drawButtons[0]
    activeDrawButton.classList.add('btn-active')
    eyedropper.classList.remove('btn-active')
}

//darken by 5 percent
function HSLDarken(hsl) {
    let sep = hsl.indexOf(",") > -1 ? "," : " ";
    hsl = hsl.substr(4).split(")")[0].split(sep);

    let h = hsl[0],
        s = hsl[1].substr(0,hsl[1].length - 1) ,
        l = hsl[2].substr(0,hsl[2].length - 1) ;

    l = l > 5 ? parseFloat(l) - 5 : parseFloat(l);

    return "hsl(" + h + "," + s + "%," + l + "%)";
}

//increase lightness by 5 percent
function HSLLighten(hsl) {
    let sep = hsl.indexOf(",") > -1 ? "," : " ";
    hsl = hsl.substr(4).split(")")[0].split(sep);

    let h = hsl[0],
        s = hsl[1].substr(0,hsl[1].length - 1) ,
        l = hsl[2].substr(0,hsl[2].length - 1) ;

    
    l = l < 95 ? parseFloat(l) + 5 : parseFloat(l);
    
    return "hsl(" + h + "," + s + "%," + l + "%)";
}

function RGBToHSL(rgb) {
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    rgb = rgb.substr(4).split(")")[0].split(sep);
  
    for (let R in rgb) {
      let r = rgb[R];
      if (r.indexOf("%") > -1) 
        rgb[R] = Math.round(r.substr(0,r.length - 1) / 100 * 255);
    }
  
    // Make r, g, and b fractions of 1
    let r = rgb[0] / 255,
        g = rgb[1] / 255,
        b = rgb[2] / 255;
  
    // Find greatest and smallest channel values
    let cmin = Math.min(r,g,b),
    cmax = Math.max(r,g,b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

    // Calculate hue
    // No difference
    if (delta == 0)
        h = 0;
    // Red is max
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
        h = (b - r) / delta + 2;
    // Blue is max
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    
    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        
    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return "hsl(" + h + "," + s + "%," + l + "%)";
}

function HSLToRGB(hsl) {
    let sep = hsl.indexOf(",") > -1 ? "," : " ";
    hsl = hsl.substr(4).split(")")[0].split(sep);
  
    let h = hsl[0],
        s = hsl[1].substr(0,hsl[1].length - 1) / 100,
        l = hsl[2].substr(0,hsl[2].length - 1) / 100;
  
    // Strip label and convert to degrees (if necessary)
    if (h.indexOf("deg") > -1) 
        h = h.substr(0,h.length - 3);
    else if (h.indexOf("rad") > -1)
        h = Math.round(h.substr(0,h.length - 3) * (180 / Math.PI));
    else if (h.indexOf("turn") > -1)
        h = Math.round(h.substr(0,h.length - 4) * 360);
    // Keep hue fraction of 360 if ending up over
    if (h >= 360)
        h %= 360;
    
    // Conversion to RGB begins
    // Must be fractions of 1

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;  
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return "rgb(" + r + "," + g + "," + b + ")";
}

function RGBtoHex(rgb){
    let output = "#"
    rgb = rgb.substr(4).split(")")[0].split(", ");

    rgb.forEach(value => {
        let hex = parseInt(value).toString(16)
        output += (hex.length == 1 ? "0" + hex : hex)
    })

    return output
}
