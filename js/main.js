$('document').ready(function() {
  $('.scroll-link').click(function(e) {
    e.preventDefault();
    var to = $(this).attr('href');
    $('html, body').animate({ scrollTop: $(to).offset().top }, 800);
  });
	
	$(window).resize(function() {
		$('body').scrollspy('refresh');
	});

  var BIG_DAY = new Date(2013, 11, 14, 15);
  var msLeft = BIG_DAY.getTime() - Date.now();
  $('#days-left').text(Math.floor(msLeft / 86400000) + ' ');

  $('.attending').change(function() {
  	var $this = $(this);
  	var $vegetarian = $('.vegetarian', $this.parent().parent());
  	if ($this.val() == 'Yes') {
  		$vegetarian.prop('disabled', false);
  	} else {
  		$vegetarian.prop('disabled', true);
  	}
  });

  $('#vegetarian-info').click(function(e) {
  	e.preventDefault();
  }).popover({
  	placement: 'auto top',
  	content: 'We are serving beef and fish, but can provide a vegetarian entree on request.',
  	container: 'table'
  });

  $('.glyphicon-remove').click(function(e) {
  	e.preventDefault();
  	$(this).parent().parent().remove();
  });

  $('#add-guest-link').click(function(e) {
  	e.preventDefault();
  	var $row = $('.table tr:last-child').clone(true);
  	$('.glyphicon-remove', $row).css('visibility', 'visible');
  	$('input', $row).val('');
  	$('.attending', $row).val('Yes');
  	$('.vegetarian', $row).val('No').prop('disabled', false);
  	$('.table').append($row);
  });

  $('#rsvp-button').click(function() {
  	$('#rsvp-button').prop('disabled', true).text('Working...')

  	var data = {};
  	var dataIndex = 0;
  	$('form tr').each(function(index) {
  		if (index > 0) {
  			var firstName = $(this).find('.first-name').val();
  			var lastName = $(this).find('.last-name').val();
  			var attending = $(this).find('.attending').val() == 'Yes';
  			var vegetarian = $(this).find('.vegetarian').val() == 'Yes';
  			if (firstName != '' || lastName != '') {
  				data['first_name_' + dataIndex] = firstName;
  				data['last_name_' + dataIndex] = lastName;
  				data['attending_' + dataIndex] = attending;
  				data['vegetarian_' + dataIndex] = vegetarian;
  				dataIndex++;
  			}
  		}
  	});
  	data.comment = $('form textarea').val();

  	$.post('/rsvp', data, function() {
  		$('#rsvp-button').text('Done!').removeClass('btn-default').addClass('btn-success');
      $('#add-guest-link').remove();
      $('form tr').each(function(index) {
        if (index > 0) {
          var firstName = $(this).find('.first-name').val();
          var lastName = $(this).find('.last-name').val();
          var attending = $(this).find('.attending').val();
          var vegetarian = $(this).find('.vegetarian').val();
          if (firstName != '' || lastName != '') {
            $(this).html('<td>' + firstName + '</td><td>' + lastName + '</td><td>' + attending + '</td><td>' + vegetarian + '</td>');
          } else {
            $(this).remove();
          }
        }
      });
      var $textArea = $('form textarea');
      var comment = $textArea.val();
      var $textAreaContainer = $textArea.parent();
      $textArea.remove();
      $textAreaContainer.append($('<p>' + comment + '</p>'));
  	});
  });
});