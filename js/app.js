let cliente ={
    mesa: '',
    hora: '', 
    pedido: []
}

const categorias ={
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
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
        //console.log('Todos los campos estan llenos');


       /*  Asignar datos del formulario al cliente */
        cliente = {...cliente, mesa, hora}
        //console.log('cliente', cliente);

        /* Ocultar modal */
        const modalFormulario = document.querySelector('#formulario');
        const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
        modalBootstrap.hide();

        /* Mostrar las secciones */
        mostrarSecciones();

        /* Obtener Platillos de la API de Json-server */
        obtenerPlatillos();

}

function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => {
        return seccion.classList.remove('d-none')
    })
}

function obtenerPlatillos() {
    const url = 'http://localhost:4000/platillos';

    fetch(url)
        .then((respuesta) => {
           //console.log('Respuesta API:',respuesta); 
           //console.log('Status',respuesta.status)
           return respuesta.json()
        })
        .then(resultado =>{
            //console.log('resultado', resultado);
            return mostrarPlatillos(resultado)
        })
        .catch(error =>{
            return console.log('Error:', error);
        })
}

function mostrarPlatillos(platillos) {
    const contenido = document.querySelector('#platillos .contenido');
    
    platillos.forEach(platillo =>{
        
        const {nombre, precio, categoria, id } = platillo;
        //console.log('platillo', platillo);

        //Scripting para agregar HTML
        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const nombrePlatillo = document.createElement('DIV');
        nombrePlatillo.classList.add('col-md-4');
        nombrePlatillo.textContent = nombre;

        const precioPlatillo = document.createElement('DIV');
        precioPlatillo.classList.add('col-md-3', 'fw-bold');
        precioPlatillo.textContent = `$ ${precio}`;


        const categoriaPlatillo = document.createElement('DIV');
        categoriaPlatillo.classList.add('col-md-3');
        categoriaPlatillo.textContent = categorias[categoria];

        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.id = `producto-${id}`;
        inputCantidad.classList.add('form-control');
        inputCantidad.value = 0;

        //Funcion quedetecta la cantidad y el platillo que se esta agregando
        inputCantidad.onchange =  function (){
            const cantidad = parseInt(inputCantidad.value);

            agregarPlatillo({...platillo, cantidad});
        }

        const agregar = document.createElement('DIV');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);


        //console.log('inputCantidad', inputCantidad)

        row.appendChild(nombrePlatillo);
        row.appendChild(precioPlatillo);
        row.appendChild(categoriaPlatillo);
        row.appendChild(agregar);
        contenido.appendChild(row);

    })
}


function agregarPlatillo(producto) {
    //console.log('desde agregar Platillo', producto);

    //Extraer el pedido actual
    let {pedido}= cliente;
    //REvisar que la cantidad sea mayor a 0
    if (producto.cantidad >0) {
        //Verifica si un producto ya existe en el array
       if(pedido.some( articulo => articulo.id === producto.id)){
            //Actualizar la cantidad
            const pedidoActualizado = pedido.map(articulo =>{
                if (articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad;
                }

                return articulo;
            });
            //Se asigna el nuevo arrar a cliente.pedido
            cliente.pedido = [...pedidoActualizado];
       } else{
            //El articulo no exite, se agrega al array de pedido.
            cliente.pedido = [...pedido, producto];
       }
        
    }else{
        //Eliminar elementos cuando la cantidad sea cero
        const resultado = pedido.filter(articulo => articulo.id !== producto.id );
        cliente.pedido= [...resultado];
        //console.log('resultado', resultado)
    }

    console.log('cliente.pedido', cliente.pedido);


    //Limpiar html previo
    limpiarHTML();

    if ( cliente.pedido.length ) {
         //mostrar el resumen de pedido
         mostrarResumen();
       
    }else{
        mensajePedidoVacio();
    }
   
}


function mostrarResumen(){
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');

    //info mesa
    const mesa = document.createElement('P');
    mesa.classList.add('fw-bold');
    mesa.textContent = 'Mesa: ';

    const mesaSpan = document.createElement('SPAN');
    mesaSpan.classList.add('fw-normal');
    mesaSpan.textContent = cliente.mesa;


    //info hora
    const hora = document.createElement('P');
    hora.classList.add('fw-bold');
    hora.textContent = 'Hora: ';

    const horaSpan = document.createElement('SPAN');
    horaSpan.classList.add('fw-normal');
    horaSpan.textContent = cliente.hora;


    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    //Titulo de la seccion
    const heading = document.createElement('H3');
    heading.textContent = 'Platillos Consumidos';
    heading.classList.add('my-4', 'text-center');

    //Iterar sobre el array de pedidos
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');

    const {pedido} = cliente;
    pedido.forEach(articulo =>{
        const { nombre, cantidad, precio, id} = articulo;
        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');

        //Nombre
        const nombreEL = document.createElement('H4');
        nombreEL.classList.add('my-4');
        nombreEL.textContent = nombre;

        //Cantidad
        const cantidadEL = document.createElement('P');
        cantidadEL.classList.add('fw-bold');
        cantidadEL.textContent = 'Cantidad: ';
        const cantidadValor = document.createElement('SPAN');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

          //Precio
          const precioEL = document.createElement('P');
          precioEL.classList.add('fw-bold');
          precioEL.textContent = 'Precio: $';
          const precioValor = document.createElement('SPAN');
          precioValor.classList.add('fw-normal');
          precioValor.textContent = precio;


         //Subtotal
         const subtotalEL = document.createElement('P');
         subtotalEL.classList.add('fw-bold');
         subtotalEL.textContent = 'Subtotal: ';
         const subtotalValor = document.createElement('SPAN');
         subtotalValor.classList.add('fw-normal');
         subtotalValor.textContent = calcularSubtotal(precio, cantidad);

        //Boton para eliminar
        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar del pedido';
        btnEliminar.onclick = function () {
            console.log('eliminando');
            eliminarProducto(id);
        }
        //Agregar a Sus contenedores
        cantidadEL.appendChild(cantidadValor);
        precioEL.appendChild(precioValor);
        subtotalEL.appendChild(subtotalValor);


        //Agregar elementos al LI
        lista.appendChild(nombreEL);
        lista.appendChild(cantidadEL);
        lista.appendChild(precioEL);
        lista.appendChild(subtotalEL);
        lista.appendChild(btnEliminar);

        //Agregar lista al grupp principal
        grupo.appendChild(lista);

        //
    });

    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

}

function calcularSubtotal(precio, cantidad) {
    return `$ ${precio * cantidad}`;
}

function eliminarProducto(id) {
    const {pedido} = cliente;
    //Eliminar elementos cuando la cantidad sea cero
    const resultado = pedido.filter(articulo => articulo.id !== id );
    cliente.pedido= [...resultado];


      //Limpiar html previo
      limpiarHTML();

      if ( cliente.pedido.length ) {
           //mostrar el resumen de pedido
           mostrarResumen();
         
      }else{
          mensajePedidoVacio();
      }

      //El producto se elimino por lo tanto regreamos la cantidad a 0 en el input
      const productoEiminado = `#producto-${id}`;
      const inputEliminado = document.querySelector(productoEiminado);
      inputEliminado.value = 0;
}

function mensajePedidoVacio(){
    console.log('hollaaaaa')
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('P');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild(texto);
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

function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido')
    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
}