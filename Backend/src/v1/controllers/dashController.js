const admin = async (req, res) => {
    res.status(200).json({ message: 'Admin route'});
}

module.exports = {
    admin
}