import PocketBase from 'pocketbase'
import Config from '../config/services/ConfigService'

const client = new PocketBase(Config.pocketBaseApiUrl)

export default client;