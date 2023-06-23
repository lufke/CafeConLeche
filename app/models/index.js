import { createRealmContext } from '@realm/react'
import { ComandaSchema } from './ComandaSchema'
import { PedidoSchema } from './PedidoSchema'
import { ProductoSchema } from './ProductoSchema'
import { MesaSchema } from './MesaSchema'

export default createRealmContext({
    schema: [ComandaSchema, PedidoSchema, ProductoSchema, MesaSchema],
})