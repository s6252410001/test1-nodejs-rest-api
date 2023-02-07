const { json } = require('express')
const express = require('express')
const { send } = require('express/lib/response')
const mysql = require('mysql')

const app = express()
app.use(express.json())

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test_nodejs_rest_api',
})

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to MySQL database =', err)
    } else {
        console.log('MySQL successfully connected..')
    }
})

//Creat
app.post("/create", async(req, res) => {
    const { user_name, user_email, user_password } = req.body

    try {
        connection.query(
            "INSERT IN TO users(user_name, user_email, user_password) VALUES(?,?,?)", [user_name, user_email, user_password],
            (err, results, fields) => {
                if (err) {
                    console.log("Error while inserting a user into the database")
                    return res.status(400).send()
                } else res.status(200).json({ message: "New user seccessfully created.." })
            }

        )
    } catch (err) {
        console.log(err);
        return res.status(500).send()
    }
})


//Read
app.get("/read/single/:email", async(req, res) => {
    const user_email = req.params.user_email
    try {
        connection.query("SELECT * FROM users WHERE user_email = ?", [user_email], (err, results, fields) => {
            if (err) {
                console.log(err)
                return res.status(400).send()
            } else {
                res.status(200).json(results)
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send()
    }
})

//Update
app.patch("/read/single/:email", async(req, res) => {
    const user_email = req.params.user_email
    const newPassword = req.body.newPassword
    try {
        connection.query("UPDATE users SET password = ? WHERE user_email = ? ", [newPassword, user_email], (err, results, fields) => {
            if (err) {
                console.log(err)
                return res.status(400).send()
            } else {
                res.status(200).json({ message: "User password updated successfully" })
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send()
    }
})

//Delete
app.delete("/delete/:email", async(req, res) => {
    const user_email = req.params.user_email
    try {
        connection.query("DELETE FROM users WHERE user_email = ? ", [user_email], (err, results, fields) => {
            if (err) {
                console.log(err)
                return res.status(400).send()
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "No user with that email" })
            }
            return res.status(200).json({ message: "User deleted successfully" })
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send()
    }
})




app.listen(78, () => console.log('Server is running on port 78'))