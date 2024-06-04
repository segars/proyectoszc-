const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors")

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sebas123",
    database: "productos"
});
db.connect();

app.post("/create", (req, res) => {
    const { Producto, Fecha, Caducidad, Cantidad, Costo } = req.body;

    db.query('INSERT INTO producto (Producto, Fecha, Caducidad, Cantidad, Costo) VALUES (?, ?, ?, ?, ?)', 
    [Producto, Fecha, Caducidad, Cantidad, Costo], 
    (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send({ id: result.insertId });
        }
    });
});

app.get("/productos", (req, res) => {
    db.query('SELECT * FROM producto', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.put("/update", (req, res) => {
    const { id, Producto, Fecha, Caducidad, Cantidad, Costo } = req.body;

    db.query('UPDATE producto SET Producto = ?, Fecha = ?, Caducidad = ?, Cantidad = ?, Costo = ? WHERE id = ?', 
    [Producto, Fecha, Caducidad, Cantidad, Costo, id], 
    (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send("Producto actualizado con éxito");
        }
    });
});
app.put("/update", (req, res) => {
    const { id, Producto, Fecha, Caducidad, Cantidad, Costo } = req.body;

    db.query('UPDATE producto SET Producto = ?, Fecha = ?, Caducidad = ?, Cantidad = ?, Costo = ? WHERE id = ?', 
    [Producto, Fecha, Caducidad, Cantidad, Costo, id], 
    (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send("Producto actualizado con éxito");
        }
    });
});



// Nueva ruta para eliminar productos
app.delete("/delete/:id", (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM producto WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send("Producto eliminado con éxito");
        }
    });
});

app.listen(3001, () => {
    console.log("Corriendo en el puerto 3001");
});
