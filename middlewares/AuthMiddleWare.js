import jwt from 'jsonwebtoken'

export const userAuthMiddleWare = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(404).send({ success: false, message: 'Token is invalid' })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).send({ success: false, message: 'Token is wrong!' })
        }
        if (user.role !== 'user') {
            return res.status(403).send('You are not a user!')
        }
        req.user = user
        next()
    })
}


export const AdminAuthMiddleWare = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(404).send({ success: false, message: 'Token is invalid' })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).send({ success: false, message: 'Token is wrong!' })
        }
        if (user.role !== 'admin') {
            return res.status(403).send('You are not a admin!')
        }
        req.user = user
        next()
    })
}
