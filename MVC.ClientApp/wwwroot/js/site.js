// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

$(function () {
    getAllClients()
});

function getAllClients () {
    $.ajax({
        url: 'api/ApiClient',
        type: 'GET',
        success: function ({ data }) {
            var tableBody = $('#clientTableBody');
            tableBody.empty();
            if (data.length === 0) {
                var noDataRow = '<tr><td colspan="4" class="text-center">No hay datos disponibles</td></tr>';
                tableBody.append(noDataRow);
            }
            $.each(data, function (index, client) {
                var row = '<tr>' +
                    '<th scope="row">' + client.id + '</th>' +
                    '<td>' + client.name + '</td>' +
                    '<td>' + client.email + '</td>' +
                    '<td>' + client.phone + '</td>' +
                    '<td>' +
                    '<button class="btn btn-sm btn-warning" onclick="showEditModal(' + client.id + ')">Editar</button> ' +
                    '<button class="btn btn-sm btn-danger" onclick="deleteClient(' + client.id + ')">Eliminar</button>' +
                    '</td>' +
                    '</tr>';
                tableBody.append(row);
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los datos:', error);
        }
    });
}

function showCreateModal() {
    var content = `
                <form id="clientForm">
                    <div class="form-group">
                        <label for="clientName">Nombre</label>
                        <input type="text" class="form-control" id="clientName" required>
                    </div>
                    <div class="form-group">
                        <label for="clientEmail">Email</label>
                        <input type="email" class="form-control" id="clientEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="clientPhone">Phone</label>
                        <input type="text" class="form-control" id="clientPhone" required>
                    </div>
                </form>
            `;
    showModal('Crear Cliente', content, saveClient);
}

function showEditModal(clientId) {
    $.ajax({
        url: 'api/ApiClient/' + clientId,
        type: 'GET',
        success: function ({ data }) {
            var content = `
                        <form id="clientForm">
                            <div class="form-group">
                                <label for="clientName">Nombre</label>
                                <input type="text" class="form-control" id="clientName" value="${data.name}" required>
                            </div>
                            <div class="form-group">
                                <label for="clientEmail">Email</label>
                                <input type="email" class="form-control" id="clientEmail" value="${data.email}" required>
                            </div>
                            <div class="form-group">
                                <label for="clientPhone">Phone</label>
                                <input type="text" class="form-control" id="clientPhone" value="${data.phone}" required>
                            </div>
                        </form>
                    `;
            showModal('Editar Cliente', content, function () { saveClient(clientId); });
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los datos del cliente:', error);
        }
    });
}

function saveClient(clientId) {
    const client = {
        name: $('#clientName').val(),
        email: $('#clientEmail').val(),
        phone: $('#clientPhone').val()
    };

    const validateClient = Object.values(client).every(val => val !== "");

    if (!validateClient) return alert("Datos requeridos!");

    // Lógica para guardar el cliente
    console.log('Cliente guardado:', client);

    const url = clientId ? 'api/ApiClient/' + clientId : 'api/ApiClient';
    const type = clientId ? 'PUT' : 'POST';

    $.ajax({
        url: url,
        type: type,
        contentType: 'application/json',
        data: JSON.stringify({
            "id": clientId,
            "name": client.name,
            "email": client.email,
            "phone": client.phone
        }),
        dataType: 'json',
        success: function ({ statusCode }) {
            if (statusCode === 400) return console.error('Error al obtener los datos:', error);
            getAllClients();
            closeModal();

        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los datos:', error);
        }
    });

}

function deleteClient(clientId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
        return;
    }

    $.ajax({
        url: 'api/ApiClient/' + clientId,
        type: 'DELETE',
        success: function () {
            getAllClients();
        },
        error: function (xhr, status, error) {
            console.error('Error al eliminar el cliente:', error);
        }
    });
}

function showModal(title, content, onSaveCallback) {
    const modal = document.getElementById('reusableModal');
    const modalLabel = document.getElementById('reusableModalLabel');
    const modalBody = document.getElementById('reusableModalBody');

    modalLabel.innerText = title;
    modalBody.innerHTML = content;
    window.onSaveCallback = onSaveCallback;

    modal.style.display = 'block';
    modal.removeAttribute('inert');
    $('#reusableModal').modal('show');
}

function closeModal() {
    const modal = document.getElementById('reusableModal');
    modal.style.display = 'none';
    modal.setAttribute('inert', '');
    $('#reusableModal').modal('hide');
}

function onSave() {
    if (window.onSaveCallback) {
        window.onSaveCallback();
    }
    closeModal();
}