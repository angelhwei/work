let btn = document.querySelector('#colorChange')
let h1 = document.querySelector('#colorText')
// btn.addEventListener('click', () => {
//     const newColor = makeRandomColor()
//     document.body.style.backgroundColor = newColor
//     h1.innerText = newColor
// })
const makeRandomColor = () => {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)
    return `rgb(${r},${g},${b})`
}
let firstScroll = true

window.addEventListener('scroll', function () {
    var images = document.querySelectorAll('.project-img')
    for (var i = 0; i < images.length; i++) {
        var imageTop = images[i].getBoundingClientRect().top
        if (imageTop < window.innerHeight) {
            images[i].style.opacity = '1'
        }
    }
})
