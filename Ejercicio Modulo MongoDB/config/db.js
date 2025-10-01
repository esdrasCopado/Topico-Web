import { MongoClient } from 'mongodb';

export default class Database {
    constructor(){
        this.url = process.env.MONGODB_URI || 'mongodb://root:password_root@localhost:27017/mydatabase?authSource=admin';
        this.options = {};
        this.client = new MongoClient(this.url, this.options);
    }
    async connect() {
        try {
            await this.client.connect();
            console.log('Connected to MongoDB');
            return this.client.db();
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }
    async disconnect() {
        try {
            await this.client.close();
            console.log('Disconnected from MongoDB');
        } catch (error) {
            console.error('Error disconnecting from MongoDB:', error);
            throw error;
        }
    }
    obtenerColeccion(nombre){
        return this.client.db().collection(nombre);
    }
}