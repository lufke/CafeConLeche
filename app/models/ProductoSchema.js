import { Realm } from '@realm/react'

export class ProductoSchema extends Realm.Object {


    static schema = {
        name: 'Producto',
        primaryKey: '_id',
        properties: {
            _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
            nombre: "string",
            categoria: "string",
            precio: { type: "int", default: 0 },
            stock: { type: "int", default: 0 },
            imagen: "string?",
        }
    }

}