$(function() {
  makeList();

  $('form').on('submit', addItem);
});

function makeList() {
  $('#todos').empty();
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
    var $li = $('<li class="' + crossed + '" id="' + id + '">' + task + '</li>');
    $('#todos').append($li);
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
