const html = document.querySelector("html")
const checkbox = document.querySelector("input[name=theme]")

const getStyle = (element, style) => 
    window
        .getComputedStyle(element)
        .getPropertyValue(style)


const initialColors = {
    whiteBackground: getStyle(html, "--white-background"),
    greenHeader: getStyle(html, "--green-header"),
    cardWhite: getStyle(html, "--card-white"),
    colorWhite: getStyle(html, "--color-white"),
}

const darkMode = {
    whiteBackground: "#353535",
    greenHeader: "#434343",
    cardWhite: "#2d2d2d",
    colorWhite: "#FFF"
}

const transformKey = key => 
    "--" + key.replace(/([A-Z])/, "-$1").toLowerCase()


const changeColors = (colors) => {
    Object.keys(colors).map(key => 
        html.style.setProperty(transformKey(key), colors[key]) 
    )
}


checkbox.addEventListener("change", ({target}) => {
    target.checked ? changeColors(darkMode) : changeColors(initialColors)
})