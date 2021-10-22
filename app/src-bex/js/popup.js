// window.location.url = 'www/index.html'
function addScript (src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')

    s.setAttribute('src', src)
    s.addEventListener('load', resolve)
    s.addEventListener('error', reject)

    document.body.appendChild(s)
  })
}
window.onload = (event) => {
  setTimeout(function () {
    // window.location.href="www/index.html"
  }, 100)
  // addScript("js/vendor.js")
  // addScript("js/app.js")
  // addScript("js/bex-init.js")
  // window.location.url = 'www/index.html'
}
