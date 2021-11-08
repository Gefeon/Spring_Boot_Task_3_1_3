let roleList = []; // глобальная переменная для хранения массива ролей
console.log(1)

// вызов метода получения всех юзеров и заполнения таблицы
getAllUsers();

function getAllUsers() {
    $.getJSON("http://localhost:8080/admin/allUsers", function (data) { // получаем users и добавляем их в data
        let rows = '';
        $.each(data, function (key, user) { // проходимся по users
            rows += createRows(user); // полученного user добавляем в строку
        });
        $('#tableAllUsers').append(rows); //строку добавляем в таблицу

        // получение ролей по url из json, добовляем в массив ролей
        $.ajax({
            url: '/admin/roles',
            method: 'GET',
            dataType: 'json',
            success: function (roles) {
                roleList = roles;
            }
        });
    });
}


//метод создания строк для таблицы
function createRows(user) {

    let user_data = '<tr id=' + user.id + '>';
    user_data += '<td>' + user.id + '</td>';
    user_data += '<td>' + user.username + '</td>';
    user_data += '<td>' + user.name + '</td>';
    user_data += '<td>' + user.surname + '</td>';
    user_data += '<td>' + user.age + '</td>';
    user_data += '<td>' + user.phoneNumber + '</td>';
    user_data += '<td>';

    let roles = user.roles; // через getJSON получаем массив ролей
    for (let role of roles) {
        user_data += role.name.replace('ROLE_', '') + ' ';
    }

    user_data += '</td>' +
        '<td>' + '<input id="btnEdit" value="Edit" type="button" ' +
        'class="btn-info btn edit-btn" data-toggle="modal" data-target="#editModal" ' +
        'data-id="' + user.id + '">' + '</td>' +

        '<td>' + '<input id="btnDelete" value="Delete" type="button" class="btn btn-danger del-btn" ' +
        'data-toggle="modal" data-target="#deleteModal" data-id=" ' + user.id + ' ">' + '</td>';
    user_data += '</tr>';
    return user_data;
}

// получаем все роли для изменения user
function getUserRolesForEdit() {
    var allRoles = [];
    $.each($("select[name='editRoles'] option:selected"), function () {
        var role = {};
        role.id = $(this).attr('id');
        role.name = $(this).attr('name');
        allRoles.push(role);
        console.log("role: " + JSON.stringify(role));
    });
    return allRoles;
}

//Edit user
//при нажатие на кнопку Edit открвается заполненное модальное окно
$(document).on('click', '.edit-btn', function () {
    const user_id = $(this).attr('data-id');
    console.log("editUserId: " + JSON.stringify(user_id));
    $.ajax({
        url: '/admin/' + user_id,
        method: 'GET',
        dataType: 'json',
        success: function (user) {
            $('#editId').val(user.id);
            $('#editUsername').val(user.username);
            $('#editName').val(user.name);
            $('#editSurname').val(user.surname);
            $('#editAge').val(user.age);
            $('#editPhoneNumber').val(user.phoneNumber);
            $('#editPassword').val(user.password);
            $('#editRole').empty();
            //для получения ролей в мадольном окне проходимся по массиву ролей, выделяем текущею роль у юзера
            roleList.map(role => {
                let flag = user.roles.find(item => item.id === role.id) ? 'selected' : '';
                $('#editRole').append('<option id="' + role.id + '" ' + flag + ' name="' + role.name + '" >' +
                    role.name.replace('ROLE_', '') + '</option>')
            })
        }
    });
});

//Отправка изменений модального окна
$('#editButton').on('click', (e) => {
    e.preventDefault();
    let userEditId = $('#editId').val();
    var editUser = {
        id: $("input[name='id']").val(),
        username: $("input[name='username']").val(),
        name: $("input[name='name']").val(),
        surname: $("input[name='surname']").val(),
        age: $("input[name='age']").val(),
        phoneNumber: $("input[name='phoneNumber']").val(),
        password: $("input[name='password']").val(),
        roles: getUserRolesForEdit()
    }

    $.ajax({
        url: '/admin',
        method: 'PUT',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(editUser),
        success: (data) => { // data - ответ с кнтроллера на бэкэнде
            let newRow = createRows(data); // создаем новую строку
            console.log("newRow: " + newRow)
            $('#tableAllUsers').find('#' + userEditId).replaceWith(newRow); // в таблице по ID находим строку, которую изменяем и заменяем ее на новую
            $('#editModal').modal('hide');
            $('#admin-tab').tab('show');
        },
        error: () => {
            console.log("error editUser")
        }
    });
});

//Delete user
//при нажатие на кнопку Delete открвается заполненное модальное окно
$(document).on('click', '.del-btn', function () {

    let user_id = $(this).attr('data-id');
    console.log("userId: " + JSON.stringify(user_id));

    $.ajax({
        url: '/admin/' + user_id,
        method: 'GET',
        dataType: 'json',
        success: function (user) {
            $('#delId').empty().val(user.id);
            $('#delUsername').empty().val(user.username);
            $('#delName').empty().val(user.name);
            $('#delSurname').empty().val(user.surname);
            $('#delAge').empty().val(user.age);
            $('#delPhoneNumber').empty().val(user.phoneNumber);
            $('#delPassword').empty().val(user.password);
            $('#delRole').empty();
            //для получения ролей в мадольном окне проходимся по массиву ролей, выделяем текущею роль у юзера
            roleList.map(role => {
                let flag = user.roles.find(item => item.id === role.id) ? 'selected' : '';
                $('#delRole').append('<option id="' + role.id + '" ' + flag + ' name="' + role.name + '" >' +
                    role.name.replace('ROLE_', '') + '</option>')
            })
        }
    });
});

//удаляет юзера при нажатие на кнопку delete в модальном окне
$('#deleteButton').on('click', (e) => {
    e.preventDefault();
    let userId = $('#delId').val();
    $.ajax({
        url: '/admin/' + userId,
        method: 'DELETE',
        success: function () {
            $('#' + userId).remove(); // удаляет юзера по айди
            $('#deleteModal').modal('hide'); // hide - скрывает модальное окно
            $('#admin-tab').tab('show'); // показать таблицу
        },
        error: () => {
            console.log("error delete user")
        }
    });
});

// получаем все роли для добавления юзера (вкладка добавить)
function getUserRolesForAdd() {
    var allRoles = [];
    $.each($("select[name='addRoles'] option:selected"), function () {
        var role = {};
        role.id = $(this).attr('id');
        role.name = $(this).attr('name');
        allRoles.push(role);
        console.log("role: " + JSON.stringify(role));
    });
    return allRoles;
}

//Add New User
//при нажатие на владку new user открывается вкладка для добавления юзера
$('.newUser').on('click', () => {

    $('#username').empty().val('')
    $('#name').empty().val('')
    $('#surname').empty().val('')
    $('#age').empty().val('')
    $('#password').empty().val('')
    $('#phoneNumber').empty().val('')
    $('#addRole').empty().val('')
    roleList.map(role => {
        $('#addRole').append('<option id="' + role.id + '" name="' + role.name + '">' +
            role.name.replace('ROLE_', '') + '</option>')
    });
})

//отправляет заполненную форму с новым юзером, юзер добавляется
$("#addNewUserButton").on('click', () => {
    let newUser = {
        username: $('#username').val(),
        name: $('#name').val(),
        surname: $('#surname').val(),
        age: $('#age').val(),
        phoneNumber: $('#phoneNumber').val(),
        password: $('#password').val(),
        roles: getUserRolesForAdd()
    }

    $.ajax({
        url: 'http://localhost:8080/admin',
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(newUser),
        contentType: 'application/json; charset=utf-8',
        success: function () {
            $('#tableAllUsers').empty();
            getAllUsers();
            $('#admin-tab').tab('show');
        },
        error: function () {
            alert('error addUser')
        }
    });
});