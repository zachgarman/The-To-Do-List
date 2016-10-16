$(function() {
  // Dynamically create the list of tasks from our DB
  makeList();
  // Listeners for adding, completing, and deleteing a task
  $('form').on('submit', addItem);
  //$('#list').on('click', '.list-item' crossOff);
  //$('.list-item').on('click', 'button', deleteItem);
});
// Empties the to do list and makes an ajax call to get all list items
function makeList() {
  $('#list').empty();
  $.ajax({
    type: 'GET',
    url: '/todo',
    success: appendList
  });
}
// Takes all items from ajax call and appends them to the DOM
// Also, creates a delete button for each task.
// Lastly, a strikethrough is placed on all items that are complete.
function appendList(response) {
  response.forEach(function(item) {
    var id = item.id;
    var task = item.list_item;
    var crossed = item.crossed_off;
    var $deleteButton = $('<button class="delete">X</button>');
    $deleteButton.data('id', id);
    var $div;
    if (crossed) {
      var $div = $('<div></div>');
      $div = $('<div class="list-item ' + crossed + '" id="' + id + '"><s>' + task + '</s></div>');
    } else {
      $div = $('<div class="list-item ' + crossed + '" id="' + id + '">' + task + '</div>');
    }
    $div.append($deleteButton);
    $('#list').append($div);
  });
}
// Takes the user input and sends it in a ajax call to the server
// makeList is run again to reflect the changes.
function addItem(event) {
  event.preventDefault();
  var newTask = $('input').serialize() + '&crossedOff=false';
  $('input').val('');
  $.ajax({
    type: 'POST',
    url: '/todo',
    data: newTask,
    success: makeList
  });
}
// Sends the information to the server to show that a task has been completed
// Then makes an ajax call to get the updated information and runs makeList to
// reflect the changes.
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
// Allows user to delete an item and have it removed from the DB
// makeList is run to reflect the changes.
function deleteItem() {
  var id = $(this).data('id');
  if (confirm('Do you seriously want to delete this item?')) {
    setTimeout(function() {
      $.ajax({
        type: 'DELETE',
        url: '/todo/' + id,
        success: makeList
      });
    }, 1000);
  }
}
