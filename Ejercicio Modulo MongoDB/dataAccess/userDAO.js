import { ObjectId } from "mongodb";

export default class UserDAO {
    constructor(database) {
        this.db = database;
        this.collection = this.db.obtenerColeccion("users");
    }

    async crear(usuario){
        const resultado = await this.collection.insertOne(usuario);
        return resultado.insertedId;
    }

    async obtenerTodos(){
        return await this.collection.find({}).toArray();
    }
    async obtenerPorId(id){
        return await this.collection.findOne({_id: new ObjectId(id)});
    }
    async actualizar(id, usuario){
        const resultado = await this.collection.updateOne(
            {_id: new ObjectId(id)},
            {$set: usuario}
        );
        return resultado.modifiedCount > 0;
    }
    async eliminar(id){
        const resultado = await this.collection.deleteOne({_id: new ObjectId(id)});
        return resultado.deletedCount > 0;
    }
}