const colorPicker = document.querySelector('#colorPicker')
const colorPickerOverlay = document.querySelector('.circle')

colorPicker.addEventListener('input', (e) => {
    console.log(e.target.value)
    colorPickerOverlay.style.backgroundColor = e.target.value
})
