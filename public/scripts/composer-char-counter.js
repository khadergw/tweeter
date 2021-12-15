/*creating the letters counter*/

$(document).ready(function() {

  $('.new-tweet textarea').on('input', function() {
    let newLength = $(this).val().length;
    let theCounter = $(this).siblings('.counter');
    const lengthLimit = 140;

    if (newLength > lengthLimit) {
      theCounter.addClass('exceededLimit');
    } else if (newLength <= lengthLimit) {
      theCounter.removeClass('exceededLimit');
    }
    theCounter.text(lengthLimit - newLength);
  });




});

