import { Realm } from '@realm/react'

export class PedidoSchema extends Realm.Object {
    static schema = {
        name: 'Pedido',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
            nombre: 'string',
            cantidad: 'int',
            precioUnitario: 'int',
            extras: 'Pedido[]',
            total: 'int',
            fechaCreacion: { type: 'date', default: () => new Date() },
            creador: 'string',
            comanda: 'string'
        }
    }
}