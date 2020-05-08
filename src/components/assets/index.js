$(function () {
  // dblclick change theme
  $(document).dblclick(function () {
    var attr = $('html').attr('data-kit-theme')
    if (attr === 'dark') {
      $('html').attr('data-kit-theme', '')
      window.localStorage.setItem('data-kit-theme', '')
    } else {
      $('html').attr('data-kit-theme', 'dark')
      window.localStorage.setItem('data-kit-theme', 'dark')
    }
  })

  // init dark theme 
  var theme = window.localStorage.getItem('data-kit-theme')
  $('html').attr('data-kit-theme', theme)
})