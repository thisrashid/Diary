var db = 0;
function populateUser(tx) {
	//tx.executeSql('DROP TABLE IF EXISTS USER');
	tx.executeSql('CREATE TABLE IF NOT EXISTS USER (_id integer primary key autoincrement, name text)');
    var id = $('#user-id').val();
    var name = $('#user-name').val();
    
    if(!id.match(/[0-9]/i)) {
    	console.log('Inserting user - ' + name + ', id -' + id + '-');
    	tx.executeSql('INSERT INTO USER (name) VALUES ("' + name + '")');
    } else {
    	console.log('updating user - ' + name + ', id - ' + id + '-');
    	tx.executeSql('UPDATE USER SET name="' + name + '" WHERE _id=' + id + '');
    }
}

function errorCBUser(err) {
   console.log("Error processing SQL: " + err.code);
   console.log(err);
   $('#user-sql-result').html("<strong>Error processing SQL: " + err.code + "</strong>");
}
function successCreateCBUser() {
   console.log("Data saved successfully");
   //$('#user-sql-result').html("<strong>Data saved successfully</strong>");
   $('#click-users').click();
}

function setUser(){
    if (!db) {
        db = window.openDatabase("Diary", "1.0", "My Diary", 200000);
    }
    db.transaction(populateUser, errorCBUser, successCreateCBUser);    
}

function deleteUser(){
    if (!db) {
        db = window.openDatabase("Diary", "1.0", "My Diary", 200000);
    }
    db.transaction(function(tx) {
    				var id = $('#user-id').val();
    				tx.executeSql('DELETE FROM USER WHERE _id=' + id);
    			}, errorCBUser, successCreateCBUser);    
}

// api-storage  "Get SQL Result Set"
function processUsersList(tx, results) {
    //console.log("Num. Rows Returned = " + results.rows.length);
    var list = $('#user-list');
    list.empty();
    console.log(results.rows.length);
    for (var i = 0; i < results.rows.length; i++) { 
		var newli = document.createElement('li');
		newli.innerHTML = '<a id="click-' + results.rows.item(i)._id + '">' + results.rows.item(i).name + '</a>';
		list.append(newli);
	}
    list.listview('refresh');
    console.log('list refreshed');
    $('#user-list li a').click(function(event) {
    	console.log('a name is clicked');
    	var attrId = $(this).attr('id');
    	console.log(attrId);
    	
    	if (attrId.indexOf("click") !== 0) {
    		console.log('Invalid ID - ' + attrId);
            return;
        }
    	clickHandler(event, 'click-addUser');
    	var id = attrId.substring(attrId.indexOf('-') + 1);
    	var name = $(this).text();
    	$('#user-id').val(id);
    	$('#user-name').val(name);
    	
    });
}
function selectUsers(tx) {
    tx.executeSql('SELECT * FROM USER', [], processUsersList, errorCBUser);
}

function getUsers() {
	console.log('getusers called');
    if (!db) {
        db = window.openDatabase("Diary", "1.0", "My Diary", 200000);
    }
    db.transaction(selectUsers, errorCBUser);    
}

$('#user-delete').click(function(event) {
    //save user
	deleteUser();
});

$('#user-submit').click(function(event) {
    //save user
	setUser();
});

$( document ).delegate("#page-users", "pagecreate", function() {
	getUsers();
});
/*
$('#users').click(function(event) {
	event.preventDefault();
	$.mobile.loadPage( "users.html" );	
	getUsers();
});*/