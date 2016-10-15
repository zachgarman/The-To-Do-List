$(function() {
  makeList();

  $('form').on('submit', addItem);
  $('#list-items').on('click', 'td', crossOff)
});

function makeList() {
  $('#list-items').empty();
  $.ajax({
    type: 'GET',
    url: '/todo',
    success: appendList
  });
}

function appendList(response) {
  response.forEach(function(item) {
    var id = item.id;
    var task = item.list_item;
    var crossed = item.crossed_off;
    var $tr = $('<tr></tr>');
    if (crossed) {
      $tr.append('<td class="' + crossed + '" id="' + id + '"><s>' + task + '</s></td>');
    } else {
      $tr.append('<td class="' + crossed + '" id="' + id + '">' + task + '</td>');
    }
    $('#list-items').append($tr);
  });
}

function addItem(event) {
  event.preventDefault();
  var newTask = $('input').serialize() + '&crossedOff=false';
  $('input').val('');
  console.log(newTask);
  $.ajax({
    type: 'POST',
    url: '/todo',
    data: newTask,
    success: makeList
  });
}

function crossOff() {
  var id = $(this).attr('id');
  var crossed = $(this).attr('class');
  var putObj = {
    'id': id,
    'crossed': crossed
  };
  $.ajax({
    type: 'PUT',
    url: '/todo/update',
    data: putObj,
    success: makeList
  });
}
