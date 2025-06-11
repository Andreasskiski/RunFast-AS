const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const SECRET_KEY = "your_secret_key";

const {pool} = require ('../data/db')


const register = async (req, res) => {
    const { name, email, password, birthdate, membershipPlan, role} = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [results] = await pool.query(
            'INSERT INTO users (name, email, password, birthdate, membershipPlan, role ) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, birthdate, membershipPlan, role]
        );

        res.status(201).json({
            id: results.insertid,
            name,
            email,
            password,
            birthdate,
            membershipPlan,
            role
        })
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
    
}

const login = async (req, res) => {
    const { name, password} = req.body;

    try {
        const [results] = await pool.query('SELECT * FROM users WHERE name = ?', [name])
        const user = results[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        

        const token = jwt.sign({ userID: user.userID, name: user.name, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}

const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const [user] = await pool.query('SELECT * FROM users WHERE userID = ?', [id]);
        

        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT * FROM users');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, birthdate, membershipPlan, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('UPDATE users SET name = ?, email = ?, password = ?, birthdate = ?, membershipPlan = ?, role = ? WHERE userID = ?', 
            [name, email, hashedPassword, birthdate, membershipPlan, role, id]);
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM users WHERE userID = ?', [id]);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    register,
    login,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser
}
