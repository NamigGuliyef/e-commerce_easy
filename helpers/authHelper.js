import { hash, genSalt, compare } from 'bcrypt'

export const hashPassword = async (password) => {
    try {
        const hashedPassword = await hash(password, await genSalt())
        return hashedPassword
    } catch (error) {
        console.log(error)
    }
}


export const comparePassword = async (password, hashedPassword) => {
    return compare(password, hashedPassword)
}
