let cliente ={
    mesa: '',
    hora: '', 
    pedido: []
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);


function guardarCliente() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    //Revisar si hay campos vacios
    const camposVacios = [mesa, hora].some(campo => campo === '');
    if (camposVacios) {
        
        mostrarAlerta('Todos los campos son obligatorios');
        return;
    } 
        console.log('Todos los campos estan llenos');
}


/* Funciones comunes */
function mostrarAlerta(mensaje) {

    //Verifica si hay alerta
    const extisteAlerta = document.querySelector('.alerta-error');

    if(!extisteAlerta){

        //Crea la alerta
        const alerta = document.createElement('DIV');
        alerta.classList.add('invalid-feedback', 'd-block', 'text-center', 'alerta-error');
        alerta.textContent = mensaje;

        //Inserta la alerta en el Modal.
        document.querySelector('.modal-body form').appendChild(alerta);

        //Elimina la alerta despues de 3s
        setTimeout(() => {
            alerta.remove();
        }, 3000);
        return;
    }

}

function limpiarHTML(selector) {
    while (selector.firstChild()) {
        selector.removeChild(selector.firstChild);
    }
}