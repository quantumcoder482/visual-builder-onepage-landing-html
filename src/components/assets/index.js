$(document).ready(function () {
  $(document).dblclick(function () {
    var attr = $('html').attr('data-kit-theme')
    if (attr === 'dark') {
      $('html').attr('data-kit-theme', '')
    } else {
      $('html').attr('data-kit-theme', 'dark')
    }
  })
})