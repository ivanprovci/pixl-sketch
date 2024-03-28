/*TODO: 
    button toggle states
    if eraser is active and you change colors, set draw as active
    clearAll/reset button
        -reset to default button states
    range meter for grid size
    rainbow color changes rgb gradually for gradient effect
    color picker from existing pixel
    color fill
    undo?
*/

const colorPicker = document.querySelector('#colorPicker')
let color = colorPicker.value
colorPicker.addEventListener('input', (e) => {
    color = e.target.value
})

const grid = document.querySelector(".grid")
const GRID_SIZE = 32
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
                //pen
                if(drawButtonsActive == drawButtons[0]) {
                    e.target.style.backgroundColor = color
                } 
                //eraser
                else if (drawButtonsActive == drawButtons[1]){
                    e.target.style.backgroundColor = "#ffffff"
                } 
                //darken
                else if (drawButtonsActive == drawButtons[2]){
                    e.target.style.backgroundColor = HSLDarken(RGBToHSL(e.target.style.backgroundColor))
                } 
                //lighten
                else if (drawButtonsActive == drawButtons[3]){
                    e.target.style.backgroundColor = HSLLighten(RGBToHSL(e.target.style.backgroundColor))
                }
            }
        })

        pixel.addEventListener('mousedown', e => {
            //pen
            if(drawButtonsActive == drawButtons[0]) {
                e.target.style.backgroundColor = color
            } 
            //eraser
            else if (drawButtonsActive == drawButtons[1]){
                e.target.style.backgroundColor = "#ffffff"
            } 
            //darken
            else if (drawButtonsActive == drawButtons[2]){
                e.target.style.backgroundColor = HSLDarken(RGBToHSL(e.target.style.backgroundColor))
            } 
            //lighten
            else if (drawButtonsActive == drawButtons[3]){
                e.target.style.backgroundColor = HSLLighten(RGBToHSL(e.target.style.backgroundColor))
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
let drawButtonsActive = drawButtons[0]
drawButtonsActive.classList.add('btn-active')

//add highlight class to draw buttons group
drawButtons.forEach( button => {
    button.addEventListener('mousedown', event => {
        drawButtonsActive.classList.remove('btn-active')

        //set new active button
        drawButtonsActive = event.target
        drawButtonsActive.classList.add('btn-active')
    })
})

//reset button - reset all pixels to white
const pixels = document.querySelectorAll('.pixel')
const btnReset = document.querySelector('#btnReset')
btnReset.addEventListener('click', e => {
    pixels.forEach(pixel => {
        pixel.style.backgroundColor = "#ffffff" 
    });
})

//darken by 10 percent
function HSLDarken(hsl) {
    let sep = hsl.indexOf(",") > -1 ? "," : " ";
    hsl = hsl.substr(4).split(")")[0].split(sep);

    let h = hsl[0],
        s = hsl[1].substr(0,hsl[1].length - 1) ,
        l = hsl[2].substr(0,hsl[2].length - 1) ;

    l = l > 5 ? parseFloat(l) - 5 : parseFloat(l);
    
    return "hsl(" + h + "," + s + "%," + l + "%)";
}

//increase lightness by 10 percent
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