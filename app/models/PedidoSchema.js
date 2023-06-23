import { Realm } from '@realm/react'

export class PedidoSchema extends Realm.Object {
    static schema = {
        name: 'Pedido',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', default: new Realm.BSON.ObjectId() },
            categoria: 'string',
            producto: 'Producto?',
            cantidad: 'int'
        }
    }
}