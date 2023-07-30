import { Realm } from '@realm/react'

export class MesaSchema extends Realm.Object {
    static schema = {
        name: 'Mesa',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
            nombre: { type: 'string' },
            ubicacion: 'string',
            ocupada: { type: 'bool', default: false },
            comanda: 'Comanda?',
        }
    }
}