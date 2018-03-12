console.log('Welcome to Aslan Ventures INC!');

// FORM SCRIPT
    // Set up an event listener for the contact form.
    $('form').submit(function(e) {

      e.preventDefault();

      // Serialize the form data.
      var formData = $('form').serialize();
      var formMessages = $('#form-messages');

      $.ajax({
        type: "POST",
        url: $('form').attr('action'),
        data: formData,
        success: function(){
          $('form').removeClass('error');
          $('form').addClass('success');
          $(formMessages).addClass('success');
          $(formMessages).removeClass('error');
          $('form button').text('Successfully Sent!');
          $('form').find('#name, #email, #phone, #message').val('');
          console.log('success');
        },
        error: function(){
          $('form').removeClass('success');
          $('form').addClass('error');
          $(formMessages).addClass('error');
          $(formMessages).removeClass('success');
          $('form button').text('Please Try Again');
          $(formMessages).text('Oops! An error occured and your message could not be sent.');
        }
      });
    });
