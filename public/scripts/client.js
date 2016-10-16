$(function() {
  // Dynamically create the list of tasks from our DB
  makeList();
  // Listeners for adding, completing, and deleteing a task
  $('form').on('submit', addItem);
  $('#list').on('click', '.list-item', crossOff);
  $('#list').on('click', 'button', deleteItem);
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
      $div = $('<div class="list-item ' + crossed + '" id="' + id + '"><p><s>' + task + '</s></p></div>');
    } else {
      $div = $('<div class="list-item ' + crossed + '" id="' + id + '"><p>' + task + '</p></div>');
    }
    $div.data('task', task);
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
function crossOff(event) {
  event.preventDefault();
  console.log('this is',$(this));
  var task = $(this).data('task');
  var id = $(this).attr('id');
  var crossed = $(this).attr('class').split(' ').pop();
  var putObj = {
    'id': id,
    'crossed': crossed
  };

  if (crossed == "true") {
    $(this).removeClass('true');
    $(this).addClass('false');
    $(this).children('p').replaceWith('<p>' + task + '</p>')
  } else {
    $(this).addClass('true');
    $(this).removeClass('false');
    $(this).children('p').replaceWith('<p><s>' + task + '</s></p>')
  }

  $.ajax({
    type: 'PUT',
    url: '/todo/update',
    data: putObj,
    success: traverseItem(id, crossed)
  });
}
// Allows user to delete an item and have it removed from the DB
// banishItem is run to reflect the changes.
function deleteItem() {
  var id = $(this).data('id');
  console.log('id for delete button', id);
  if (confirm('Do you seriously want to delete this item?')) {
    $.ajax({
      type: 'DELETE',
      url: '/todo/' + id,
      success: banishItem(id)
    });
  }
  // returning false to stop bubbling where crossOff() would also run.
  return false;
}
// This is run whenever an item is deleted in order to hide the item in style.
function banishItem(id) {
  $('#list').children('#' + id).slideToggle('slow');
}
// This slideToggles a div, then moves it to the bottom of the list.
function traverseItem(id, crossed) {
  var $div = $('#list').children('#' + id)
  $div.slideToggle('slow', function() {
    if (crossed == 'true') {
      $('#list').prepend($div);

    } else {
      $('#list').append($div);
    }
    $div.slideToggle();
  });
}
