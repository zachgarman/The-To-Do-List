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
    success: newItem
  });
}

function newItem (response) {
  var crossed = false;
  var id = response[0].id;
  var task = response[0].list_item;
  var $item = $('<div class="list-item ' + crossed + '" id="' + id + '"><p>' + task + '</p></div>').hide();
  var $deleteButton = $('<button class="delete">X</button>');
  $item.data('task', task);
  $deleteButton.data('id', id);
  $item.append($deleteButton);
  $item.prependTo('#list').slideToggle();
}
// Sends the information to the server to show that a task has been completed
// Then makes an ajax call to get the updated information and runs traverseItem
// to reflect the changes, without reloading all elements.
function crossOff(event) {
  event.preventDefault();
  var task = $(this).data('task');
  var id = $(this).attr('id');
  var crossed = $(this).attr('class').split(' ').pop();
  var putObj = {
    'id': id,
    'crossed': crossed
  };

  $.ajax({
    type: 'PUT',
    url: '/todo/update',
    data: putObj,
    success: traverseItem(id, crossed, task)
  });
}
// Allows user to delete an item and have it removed from the DB
// banishItem is run to reflect the changes.
function deleteItem() {
  var id = $(this).data('id');
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
// This slideToggles a div, then moves it to the bottom or top of the list
// depending on whether it is now complete.
function traverseItem(id, crossed, task) {
  var $div = $('#list').children('#' + id)
  console.log(task);
  $div.slideToggle('slow', function() {
    // This allows a strikethrough to be added or removed whenever a task
    // is completed or moved back into incomplete status.  Change made here
    // so that you cannot see the changes.
    if (crossed == 'true') {
      $(this).removeClass('true');
      $(this).addClass('false');
      $(this).children('p').replaceWith('<p>' + task + '</p>')
    } else {
      $(this).addClass('true');
      $(this).removeClass('false');
      $(this).children('p').replaceWith('<p><s>' + task + '</s></p>')
    }
    // Move completed items to the bottom, incomplete to the top of the list.
    if (crossed == 'true') {
      $('#list').prepend($div);
    } else {
      $('#list').append($div);
    }
    $div.slideToggle();
  });
}
