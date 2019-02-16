$(function() {
  //////////////////////////////////////////////////
  //  Make dropdown menus keyboard accessible
  $('.ctf-nav-item-dropdown-toggle .ctf-nav-link, .ctf-nav-sub-link')
    .focus(function() {
      $('.ctf-nav-item-dropdown-toggle').addClass('hover')
    })
    .blur(function() {
      $('.ctf-nav-item-dropdown-toggle').removeClass('hover')
    })

  //////////////////////////////////////////////////
  //  Toggle mobile menu
  $('.ctf-nav-toggle').click(function() {
    $('.ctf-nav-toggle').toggleClass('ctf-nav-toggle-open')
    $('.ctf-nav-list').toggleClass('ctf-nav-list-open')
  })

  //////////////////////////////////////////////////
  //  Bootstrap Tooltips
  $('[data-toggle="tooltip"]').tooltip()
})
