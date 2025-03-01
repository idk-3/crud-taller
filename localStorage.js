//variables globales
const d = document;
let nombrePro = d.querySelector("#nombrePro");
let precioPro = d.querySelector("#precioPro");
let descripcionPro = d.querySelector("#descripcionPro");
let imagenPro = d.querySelector("#imagenPro");
let btnGuardar = d.querySelector(".btnGuardar");
let tabla = d.querySelector(".table > tbody");

//agregar evento click al boton
btnGuardar.addEventListener("click", ()=> {
    //alert( nombrePro.value );
    validarDatos();
    borrarTabla();
    mostrarDatos();
});

//funcion para validar datos del formulario
function validarDatos(){
    let producto;
    if( nombrePro.value && precioPro.value && descripcionPro.value && imagenPro.value){
        //alert("todos los campos ok👍")
        producto ={
            nombre : nombrePro.value,
            precio : precioPro.value,
            descripcion : descripcionPro.value,
            imagen : imagenPro.value
        }

        console.log( producto );
        guardarDatos( producto);
    }
    else{
        alert("todos los campos son obligatorios❗❗☢☢")
    }
    nombrePro.value = "";
precioPro.value = "";
descripcionPro.value = "";
imagenPro.value = "";
}

d.addEventListener('keyup', (e) => {
    if (e.target.matches('#buscador')) {
        d.querySelectorAll('tbody > tr').forEach((row) => {
            const text = row.textContent.toLowerCase();
            const search = e.target.value.toLowerCase();
            if (text.includes(search)) {
                row.classList.remove('d-none');
            } else {
                row.classList.add('d-none');
            }
        });
    }
});


//funcion para guardar datos en localstorage
function guardarDatos( pro ){
    //validar datos previamente guardados en localStorage
    let producto = JSON.parse(localStorage.getItem("productos"))  || [];
    //agregar un nuevo dato al array
    producto.push( pro );
    // guardar los datos en localStorage
    localStorage.setItem("productos", JSON.stringify(producto));
    alert("el producto fue guardado con exito 👍")
}

//funcion para mostrar los productos guardados en localStorage
function mostrarDatos(){
    let productos = [];
    // extrar datos guardados previamente en el local storage
    let productosPrevios = JSON.parse(localStorage.getItem("productos"));
    //validar datos guardados previamente en el local storage
    if(productosPrevios != null){
        productos = productosPrevios;
    }

    //console.log(productos);
    productos.forEach((p,i) =>{
        let fila = d.createElement("tr");
        fila.innerHTML = `
            <td>${i+1}</td> 
            <td>${p.nombre}</td>
            <td>${p.precio}</td>
            <td>${p.descripcion}</td>
            <td><img src="${p.imagen} width="50"></td>
            <td>
                 <span onclick="actualizarProductos(${i})" class="btn-editar btn btn-warning"> 📄 </span>
                 <span onclick="eliminarProducto(${i})" class="btn-editar btn btn-danger"> ❌ </span>
            </td>

        `;	
        tabla.appendChild(fila);
    });
}
//quitar los campos de la tabla 
function borrarTabla() {
    let filas = d.querySelectorAll(".table tbody tr");
    filas.forEach( (f)=> {
        f.remove();
    });
}


function eliminarProducto( pos ){
    let productos = [];
    // extraer datos guardados previamente en el local storage
    let productosPrevios = JSON.parse(localStorage.getItem("productos"))
    //validar datos guardados previamente en el local storage
    if( productosPrevios != null){
        productos = productosPrevios;
    }

    //confirmar pedido a eliminar
    let confirmar = confirm("¿Desea eliminar este producto? " + productos[pos].nombre + "?");
    if( confirmar) {
        //alert("eliminaste el producto")
        let p = productos.splice(pos, 1);
        alert("el producto"+ p.producto +" ha sido eliminado con exito")
        //guardar los datos en localStorage
        localStorage.setItem("productos", JSON.stringify(productos));
        //actualizar datos
        borrarTabla();
        mostrarDatos();
    }

}


// actualizar pedido de localStorage
function actualizarProductos( pos ){
    let productos = [];
    // extraer datos guardados previamente en el local storage
    let productosPrevios = JSON.parse(localStorage.getItem("productos"))
    //validar datos guardados previamente en el local storage
    if( productosPrevios != null){
        productos = productosPrevios;
    }
        nombrePro.value = productos[pos].nombre;
        precioPro.value = productos[pos].precio;
        descripcionPro.value = productos[pos].descripcion;
        imagenPro.value = productos[pos].img
    //seleccionar el boton de editar o actualizar
    let btnActualizar = d.querySelector('.btnActualizar');
    btnActualizar.classList.toggle("d-none");
    btnGuardar.classList.toggle("d-none");
    //agregar un evento al boton actualizar
    btnActualizar.addEventListener("click", function() {
        productos[pos].nombre = nombrePro.value;
        productos[pos].precio = precioPro.value;
        productos[pos].descripcion = descripcionPro.value;
        productos[pos].img = imagenPro.value;
        //guardar los datos editados en localStorage
        localStorage.setItem("productos", JSON.stringify(productos));
        alert("el dato fue actualizado con exito")

        nombrePro.value = "";
        precioPro.value = "";
        descripcionPro.value = "";
        imagenPro.value = "";

        btnActualizar.classList.toggle("d-none");
        btnGuardar.classList.toggle("d-none");

        borrarTabla();
        mostrarDatos();

    });
    
}


//mostrar los datos de localStorage al recargar la pagina
d.addEventListener("DOMContentLoaded", function() {
borrarTabla();
mostrarDatos();
});


d.getElementById("exportarPDF").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Selecciona el cuerpo de la tabla
    const tabla = d.querySelector("tbody");
    if (!tabla) {
        console.error("No se encontró el cuerpo de la tabla");
        return;
    }

    // Obtén las filas de la tabla
    const filas = tabla.querySelectorAll("tr"); // Asegúrate de definir "filas" aquí
    let inicioY = 30;

    // Recorre las filas y genera el contenido para el PDF
    filas.forEach((fila, index) => {
        const celdas = fila.querySelectorAll("td");
        let textoFila = `${index + 1}. `;
        celdas.forEach((celda) => {
            textoFila += `${celda.textContent} | `;
        });
        doc.text(textoFila, 14, inicioY);
        inicioY += 10;
    });

    // Guarda el PDF
    doc.save("listado_productos.pdf");
});