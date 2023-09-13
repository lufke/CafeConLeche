import { Realm } from '@realm/react'

export class ComandaSchema extends Realm.Object {
    static schema = {
        name: 'Comanda',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
            fechaCreacion: { type: 'date', default: () => new Date() },
            pedidos: 'Pedido[]',
            total: { type: 'int', default: 0 },
            propina: { type: 'int', default: 0 },
            creador: 'string?',
            pagado: { type: 'bool', default: false },
            mesa: 'string',
            mesaName: 'string',
            activa: { type: 'bool', default: true }

        }
    }
}