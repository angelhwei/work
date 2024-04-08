document.querySelectorAll('section').forEach(section => {
    section.style.display = 'none'
})
document.getElementById('profile').style.display = 'block'

document.querySelectorAll('.nav-text').forEach(a => {
    a.addEventListener('click', function (e) {
        e.preventDefault()
        const targetId = this.dataset.target
        document.querySelectorAll('section').forEach(section => {
            section.style.display = 'none'
        })
        let currentSec = document.getElementById(targetId)
        currentSec.style.display = 'block'

        // Scroll to the top of the current section
        currentSec.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
})
