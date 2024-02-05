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
                if(e.target.style.backgroundColor !== color){
                    e.target.style.backgroundColor = color
                }
            }
        })

        pixel.addEventListener('mousedown', e => {
            e.target.style.backgroundColor = color
        })
        
        //disables dragging the pixel element bug
        pixel.addEventListener('dragstart', e => {
            e.preventDefault()
        })
    }
}


const btnDraw = document.querySelector('#btnDraw')
const btnEraser = document.querySelector('#btnEraser')
const btnDarken = document.querySelector('#btnDarken')
const btnLighten = document.querySelector('#btnLighten')

const drawButtons = [btnDraw, btnEraser, btnDarken, btnLighten]

drawButtons.forEach( button => {
    button.addEventListener('mousedown', event => {
        drawButtons.forEach( button => {
            button.classList.remove('btn-active')
        })
        event.target.classList.add('btn-active')
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
    clearAll/reset button
        -reset to default button states
    range meter for grid size
    rainbow color changes rgb gradually for gradient effect
    color picker from existing pixel
    color fill
    undo?
*/