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
        grid.appendChild(pixel)

        //mouse1 is already being held when it enters the pixel
        pixel.addEventListener('mouseover', e => {
            if(e.buttons === 1) {
                if(drawButtonsActive == drawButtons[0]) {
                    e.target.style.backgroundColor = color
                } else if (drawButtonsActive == drawButtons[1]){
                    e.target.style.backgroundColor = "#ffffff"
                } else if (drawButtonsActive == drawButtons[2]){
                    //e.target.style.backgroundColor = "#ffffff"
                } else if (drawButtonsActive == drawButtons[3]){
                    //e.target.style.backgroundColor = "#ffffff"
                }
            }
        })

        pixel.addEventListener('mousedown', e => {
            if(drawButtonsActive == drawButtons[0]) {
                e.target.style.backgroundColor = color
            } else if (drawButtonsActive == drawButtons[1]){
                e.target.style.backgroundColor = "#ffffff"
            } else if (drawButtonsActive == drawButtons[2]){
                //e.target.style.backgroundColor = "#ffffff"
            } else if (drawButtonsActive == drawButtons[3]){
                //e.target.style.backgroundColor = "#ffffff"
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

const pixels = document.querySelectorAll('.pixel')
const btnReset = document.querySelector('#btnReset')
btnReset.addEventListener('click', e => {
    pixels.forEach(pixel => {
        pixel.style.backgroundColor = "#ffffff" 
    });
})

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

//input comes in the form of #aabbcc
//returns the same value but adds #010101 to it
//range 00 to ff (for either red/green/blue)
function increaseHex(input){
    //remove the '#' char
    input = input.substr(1)

    input = parseInt(input, 16)
    // input += 0x010101

    input = input.toString(16)
    while(input.length < 6){
        input = '0' + input.substring(0)
    }

    return '#' + input.substring(0);

}
// color = '#010101'
console.log(color)
console.log(typeof(increaseHex(color)))
console.log(increaseHex(color))