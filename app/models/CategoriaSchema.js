import { Realm } from '@realm/react'

export class CategoriaSchema extends Realm.Object {
    static schema = {
        name: 'Categoria',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
            nombre: { type: 'string', },
            productos: 'Producto[]'
        }
    }
}