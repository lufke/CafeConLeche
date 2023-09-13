import { createRealmContext } from '@realm/react'
import { ComandaSchema } from './ComandaSchema'
import { PedidoSchema } from './PedidoSchema'
import { ProductoSchema } from './ProductoSchema'
import { MesaSchema } from './MesaSchema'
import { CategoriaSchema } from './CategoriaSchema'

export default createRealmContext({
    schema: [CategoriaSchema, ComandaSchema, PedidoSchema, ProductoSchema, MesaSchema],
})