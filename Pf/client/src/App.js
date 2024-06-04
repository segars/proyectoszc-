import './App.css'; // Importa el archivo de estilos CSS
import React, { useState, useEffect } from 'react'; // Importa React y los hooks useState y useEffect
import Axios from 'axios'; // Importa Axios para hacer peticiones HTTP
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa estilos CSS de Bootstrap
import moment from 'moment'; // Importa la librería moment para manejar fechas
import { Dropdown } from 'react-bootstrap'; // Importa el componente Dropdown de react-bootstrap

function App() {
  // Estados para los campos del formulario
  const [Producto, setProducto] = useState(""); // Estado para el nombre del producto
  const [Fecha, setFecha] = useState(""); // Estado para la fecha de entrada del producto
  const [Caducidad, setCaducidad] = useState(""); // Estado para la fecha de caducidad del producto
  const [Cantidad, setCantidad] = useState(""); // Estado para la cantidad del producto
  const [Costo, setCosto] = useState(""); // Estado para el costo del producto
  const [id, setId] = useState(""); // Estado para el ID del producto
  const [productosList, setProductos] = useState([]); // Estado para la lista de productos
  const [editar, setEditar] = useState(false); // Estado para indicar si se está editando un producto
  const [advertencia, setAdvertencia] = useState(false); // Estado para mostrar advertencia si faltan datos
  const [dropdownOpen, setDropdownOpen] = useState(false); // Estado para controlar la apertura del Dropdown
  const [filtro, setFiltro] = useState(""); // Estado para filtrar productos por nombre

  // Función para agregar un nuevo producto
  const add = () => {
    // Verifica si todos los campos están llenos
    if (!Producto || !Fecha || !Caducidad || !Cantidad || !Costo) {
      setAdvertencia(true); // Muestra advertencia si falta algún dato
      return;
    }
    setAdvertencia(false); // Oculta la advertencia

    // Realiza una petición HTTP POST para agregar el nuevo producto a la base de datos
    Axios.post("http://localhost:3001/create", {
      Producto,
      Fecha,
      Caducidad,
      Cantidad,
      Costo
    })
    .then((response) => {
      // Agrega el nuevo producto con su ID devuelto por la base de datos a la lista de productos
      const newProduct = { id: response.data.id, Producto, Fecha, Caducidad, Cantidad, Costo };
      setProductos([...productosList, newProduct]);
      alert("Producto registrado"); // Muestra una alerta de éxito
      cancelar(); // Limpia los campos del formulario
    })
    .catch(error => {
      alert("Error al registrar el producto: " + error.message); // Muestra una alerta de error
    });
  }

  // Función para actualizar un producto existente
  const update = () => {
    // Verifica si todos los campos están llenos
    if (!Producto || !Fecha || !Caducidad || !Cantidad || !Costo) {
      setAdvertencia(true); // Muestra advertencia si falta algún dato
      return;
    }
    setAdvertencia(false); // Oculta la advertencia

    // Realiza una petición HTTP PUT para actualizar el producto en la base de datos
    Axios.put("http://localhost:3001/update", {
      id,
      Producto,
      Fecha,
      Caducidad,
      Cantidad,
      Costo
    })
    .then((response) => {
      // Actualiza el estado de los productos después de la actualización
      const updatedProducts = productosList.map(product => {
        if (product.id === id) {
          return {
            id: product.id,
            Producto,
            Fecha,
            Caducidad,
            Cantidad,
            Costo
          };
        }
        return product;
      });
      setProductos(updatedProducts);
      alert("Producto actualizado"); // Muestra una alerta de éxito
      cancelar(); // Limpia los campos del formulario
    })
    .catch(error => {
      alert("Error al actualizar el producto: " + error.message); // Muestra una alerta de error
    });
  }

  // Función para editar un producto existente
  const editarProducto = (val) => {
    setEditar(true); // Indica que se está editando un producto
    setDropdownOpen(true); // Abre el Dropdown al hacer clic en "Editar"

    // Establece los valores del producto a editar en los estados correspondientes
    setProducto(val.Producto);
    if (val.Fecha) {
      setFecha(val.Fecha);
    }
    if (val.Caducidad) {
      setCaducidad(val.Caducidad);
    }
    setCantidad(val.Cantidad);
    setCosto(val.Costo);
    setId(val.id);
  }

  // Función para cancelar la edición o el registro
  const cancelar = () => {
    // Limpia los campos del formulario y los estados relacionados con la edición
    setProducto("");
    setFecha("");
    setCaducidad("");
    setCantidad("");
    setCosto("");
    setId("");
    setEditar(false);
    setDropdownOpen(false);
  }

  // Función para eliminar un producto con confirmación
  const eliminarProducto = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      // Realiza una petición HTTP DELETE para eliminar el producto de la base de datos
      Axios.delete(`http://localhost:3001/delete/${id}`)
      .then(() => {
        // Filtra la lista de productos para eliminar el producto con el ID especificado
        setProductos(productosList.filter(product => product.id !== id));
        alert("Producto eliminado"); // Muestra una alerta de éxito
      })
      .catch(error => {
        alert("Error al eliminar el producto: " + error.message); // Muestra una alerta de error
      });
    }
  }

  // Función para obtener la lista de productos al cargar la página
  const getProductos = () => {
    // Realiza una petición HTTP GET para obtener la lista de productos de la base de datos
    Axios.get("http://localhost:3001/productos")
    .then((response) => {
      // Verifica que los datos recibidos sean los esperados
      if (Array.isArray(response.data)) {
        // Convierte los datos recibidos en un formato adecuado y los guarda en el estado correspondiente
        const validProducts = response.data.map(product => ({
          ...product,
          Costo: product.Costo?.data ? new TextDecoder().decode(new Uint8Array(product.Costo.data)) : product.Costo
        }));
        setProductos(validProducts);
      } else {
        console.error("Los datos recibidos no son un array:", response.data);
      }
    })
    .catch(error =>
 {
  alert("Error al obtener los productos: " + error.message); // Muestra una alerta de error si falla la solicitud
});
}

// Función para formatear la fecha usando la librería moment.js
const formattedFecha = (fecha) => {
return moment(fecha).format('YYYY-MM-DD');
};

// Filtra los productos por nombre según el texto ingresado en el campo de búsqueda
const productosFiltrados = productosList.filter(producto =>
producto.Producto.toLowerCase().includes(filtro.toLowerCase())
);

// Obtiene la lista de productos al cargar la página
useEffect(() => {
getProductos();
}, []);


  // inicio del formulario
  return (
    <div className="container">
      <Dropdown show={dropdownOpen}>
        <Dropdown.Toggle variant="primary" id="dropdown-basic" onClick={() => setDropdownOpen(!dropdownOpen)}>
          Registrar un producto
        </Dropdown.Toggle>

        <Dropdown.Menu style={{ minWidth: '33rem', padding: '1rem' }}>
          <div className="card text-center">
            <div className="card-header">
              FORMULARIO DE REGISTRO
            </div>
            <div className="card-body">
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Producto</span>
                <input 
                  type="text"
                  onChange={(event) => setProducto(event.target.value)}
                  className="form-control" value={Producto}
                  placeholder="Ingrese el nombre del Producto" 
                  aria-label="Producto" 
                  aria-describedby="basic-addon1" 
                />
              </div>
              <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Fecha de entrada</span>
                <input 
                  type="date"
                  onChange={(event) => setFecha(event.target.value)}
                  className="form-control" value={Fecha}
                  placeholder="Ingrese la fecha de entrada" 
                  aria-label="Fecha de entrada" 
                  aria-describedby="basic-addon1" 
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Fecha de caducidad</span>
                <input 
                  type="date"
                  onChange={(event) => setCaducidad(event.target.value)}
                  className="form-control" value={Caducidad}
                  placeholder="Ingrese la fecha de caducidad"
                  aria-label="Fecha de caducidad" 
                  aria-describedby="basic-addon1" 
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Cantidad</span>
                <input 
                  type="number"
                  onChange={(event) => setCantidad(event.target.value)}
                  className="form-control" value={Cantidad}
                  placeholder="Ingrese la cantidad del producto" 
                  aria-label="Cantidad" 
                  aria-describedby="basic-addon1" 
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Costo del Producto</span>
                <input 
                  type="number"
                  onChange={(event) => setCosto(event.target.value)}
                  className="form-control" value={Costo}
                  placeholder="Ingrese el precio de este producto" 
                  aria-label="Costo del Producto" 
                  aria-describedby="basic-addon1" 
                />
              </div>
            </div>
            <div className="card-footer text-body-secondary">
              {
                editar?
                  <div>
                    <button className='btn btn-outline-warning' onClick={update}>Actualizar</button>  
                    <button className='btn btn-outline-danger' onClick={cancelar}>Cancelar</button>
                  </div>
                  : <button className='btn btn-info' onClick={add}>Registrar</button>
              }
              {advertencia && <p className="text-danger">Por favor, complete todos los campos.</p>}
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>


      {/* Barra de búsqueda */}
      <div className="input-group mt-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre de producto"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>
      
      {/* logica de la tabla*/}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Producto</th>
            <th scope="col">Fecha de ingreso</th>
            <th scope="col">Fecha de caducidad</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Costo</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>

           {/* mapea los productos que se ingresan en la barra de busqueda*/}
          {productosFiltrados.map((val) => {
            return (
              <tr key={val.id}>
                <th>{val.id}</th>
                <td>{val.Producto}</td>
                <td>{formattedFecha(val.Fecha)}</td> 
                <td>{formattedFecha(val.Caducidad)}</td> 
                <td>{val.Cantidad}</td>
                <td>{val.Costo}</td>
                <td>

                   {/* Botones de accion, eliminar y editar*/}
                  <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button"
                      onClick={() => {
                        editarProducto(val)
                      }}
                      className="btn btn-primary">Editar</button>
                    <button type="button"
                      onClick={() => {
                        eliminarProducto(val.id)
                      }}
                      className="btn btn-danger">Eliminar</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;