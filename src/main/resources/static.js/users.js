//Глобальный массив ролей
let roleList = [];
console.log(1)
//Сразу получаем всех пользователей, таблица *заполняется
getAllUsers();

function getAllUsers() {
    //Получаем json с помощтю соотв. запроса, складываем результат в -> data <-
    $.getJSON("http://localhost:8080/admin/allUsers", function (data) {
        //Создаем переменную для строк
        let rows = '';
        //Для каждого user создаем свою строку
        $.each(data, function (key, user) {
            rows += createRows(user);
        });
        //И добавляем строки в нужный див с таблицей id='tableAllUsers'
        $('#tableAllUsers').append(rows);

        //Подгружаем роли в массив, это достаточно сделать один раз
        $.ajax({
            url: '/admin/authorities',
            method: 'GET',
            dataType: 'json',
            success: function (roles) {
                roleList = roles;
            }
        });
    });
}


//Создаем строкУ для таблицы по переданному user
function createRows(user) {

    //Здесь инжектим html код просто как string, это интересно
    let user_data = '<tr id=' + user.id + '>';
    user_data += '<td>' + user.id + '</td>';
    user_data += '<td>' + user.username + '</td>';
    user_data += '<td>' + user.name + '</td>';
    user_data += '<td>' + user.surname + '</td>';
    user_data += '<td>' + user.age + '</td>';
    user_data += '<td>' + user.phoneNumber + '</td>';

    user_data += '<td>';
    let roles = user.roles;
    for (let role of roles) {
        user_data += role.name + ' ';
    }
    user_data += '</td>';

    // Добавляем кнопки
    user_data +=

        '<td>' +
        '<input id="btnEdit" ' +
        'value="Edit" ' +
        'type="button" ' +
        'class="btn-info btn edit-btn" ' +
        'data-toggle="modal" ' +
        'data-target="#editModal" ' +
        'data-id="' + user.id + '">' +
        '</td>' +

        '<td>' +
        '<input id="btnDelete" ' +
        'value="Delete" ' +
        'type="button" ' +
        'class="btn btn-danger del-btn" ' +
        'data-toggle="modal" ' +
        'data-target="#deleteModal" ' +
        'data-id=" ' + user.id + ' ">' +
        '</td>';

    user_data += '</tr>';

    return user_data;
}


// Получаем роли для EditUser, заполняем селектор
function getUserRolesForEdit() {
    var allRoles = [];
    $.each($("select[name='editRoles'] option:selected"), function () {
        var role = {};
        role.id = $(this).attr('id');
        role.name = $(this).attr('name');
        allRoles.push(role);
    });
    return allRoles;
}


// Если мы в Документе, кликаем по чему-то класса .edit-btn, то происходит вот что
$(document).on('click', '.edit-btn', function () {
    //Переменной user_id мы присваеваем значение из data-id, т.е. узнаем, у какого пользователя нажата кнопка
    const user_id = $(this).attr('data-id');
    //Отправляем запрос, получаем пользователя и все его поля, это нужно, чтобы заполнить соотв. форму.
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
            //Здесь тоже инжект html, заполняем селектор с выбором ролей
            roleList.map(role => {
                $('#editRole').append('<option id="' + role.id + '" ' + ' name="' + role.name + '" >' +
                    role.name + '</option>')
            })
        }
    });
});

// тут магия, которая происходит по нажатию кнопки Edit в модальном окне
$('#editButton').on('click', (e) => {
    //Останавливаем действия по умолчанию у кнопки
    e.preventDefault();
    //Получаем текущий id юзера
    let userEditId = $('#editId').val();
    //Заносим в переменную обновленного юзера, получая данные из полей формы.
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
    // отправляем запрос
    $.ajax({
        url: '/admin',
        method: 'PUT',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        //Передаем пользователя как json
        data: JSON.stringify(editUser),
        //Добавляем новую строку в таблицу, скрывем модалку Edit, показываем таблицу с юзерами
        success: (data) => {
            let newRow = createRows(data);
            $('#tableAllUsers').find('#' + userEditId).replaceWith(newRow);
            $('#editModal').modal('hide');
            $('#admin-tab').tab('show');
        },
    });
});


//действия по нажатию на кнопку .del-btn
$(document).on('click', '.del-btn', function () {
    //Получаем юзера
    let user_id = $(this).attr('data-id');

    //отправляем запрос на получение данных для формы
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

            roleList.map(role => {
                let flag = user.authorities.find(item => item.id === role.id) ? 'selected' : '';
                $('#delRole').append('<option id="' + role.id + '" ' + flag + ' name="' + role.name + '" >' +
                    role.name.replace('ROLE_', '') + '</option>')
            })
        }
    });
});


//Внутри модального окна Delete нажимаем на кнопку Delete
$('#deleteButton').on('click', (e) => {
    //Блокируем поведение по умолчанию
    e.preventDefault();
    //Получаем айди пользователя из кнопки ( =С )
    let userId = $('#delId').val();
    //Отправляем Delete запрос
    $.ajax({
        url: '/admin/' + userId,
        method: 'DELETE',
        //В случае успеха скрываем модаль, показываем таблицу юзеров
        success: function () {
            $('#' + userId).remove();
            $('#deleteModal').modal('hide');
            $('#admin-tab').tab('show');
        }
    });
});


function getUserRolesForAdd() {
    // Иниц. массив для складывания ролей в него.
    var allRoles = [];
    // Из селектора, куда роли пришли из массива всех ролей, мы получаем массив ролей для текущего пользователя
    $.each($("select[name='addRoles'] option:selected"), function () {
        //Вот тут мы получаем объект role, в него складываем id и name
        const role = {};
        role.id = $(this).attr('id');
        role.name = $(this).attr('name');
        //И добавляем к массиву ролей
        allRoles.push(role);
    });
    return allRoles;
}


// Клик по вкладке с добавлением нового пользователя вызывает модальное окно, а
// отсюда мы заполняем поля формы
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
            role.name + '</option>')
    });

})


// Кликаем по кнопке addNewUserButton внутри окна добавления нового юзера
$("#addNewUserButton").on('click', () => {
    // Пусть новый юзер будет обладать всеми свойствами, подобающими юзеру
    let newUser = {
        username: $('#username').val(),
        name: $('#name').val(),
        surname: $('#surname').val(),
        age: $('#age').val(),
        phoneNumber: $('#phoneNumber').val(),
        password: $('#password').val(),
        roles: getUserRolesForAdd()
    }
    // Отправляем запрос на добавление
    $.ajax({
        url: 'http://localhost:8080/admin',
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(newUser),
        contentType: 'application/json; charset=utf-8',
        // В случае спеха
        success: function () {
            //Очищаем таблицу с юзерами
            $('#tableAllUsers').empty();
            //Заново ее заполняем
            getAllUsers();
            //И показываем
            $('#admin-tab').tab('show');
        }
    });
});