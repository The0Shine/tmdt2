import Repository from './Axios'

export const mainRepository = new Repository(import.meta.env.VITE_BASE_URL)
