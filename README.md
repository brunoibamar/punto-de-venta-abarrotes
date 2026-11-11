# La Tiendita · Punto de venta

Aplicación web para una tienda de abarrotes, adaptable a teléfono, tableta y computadora.

## Abrir la aplicación

Sirve la carpeta desde un servidor web local o de desarrollo en HTTPS. El selector de carpeta de Android requiere un navegador compatible y un contexto seguro. En Chrome de Android, abre **Elegir carpeta** y selecciona la carpeta donde guardar `tiendita-datos.json`.

Los lectores de código configurados como teclado pueden escribir en el campo de búsqueda; se agrega automáticamente el artículo cuando el lector envía el código completo. En Android, el botón Cámara usa el detector de códigos disponible en el navegador y solicita permiso para la cámara. Los productos por kilo solicitan el peso en gramos.

## Alcance de esta primera versión

- Elige una carpeta y guarda allí el inventario y el historial en `tiendita-datos.json`.
- Recupera los datos desde esa carpeta al volver a abrir la aplicación cuando el navegador conserva el permiso.
- Registra ventas en efectivo, tarjeta, transferencia o fiado; calcula cambio con importes sugeridos y separa cada forma de pago en el resumen y corte. El fiado se asigna a clientes, admite abonos en efectivo o transferencia y no se suma al cajón al vender. El estado de cuenta muestra ventas, abonos y los resúmenes mensuales archivados. El encargado puede exportar en CSV los movimientos y saldos actuales de todas las cuentas. El carrito pendiente se conserva en la misma pestaña si la aplicación se actualiza o recarga. Los tickets con deuda pendiente se conservan aunque tengan más de un año; al liquidarse podrán archivarse.
- Permite anular una venta con PIN de encargado y motivo; conserva el ticket, repone existencias opcionalmente y registra reembolsos en efectivo como salida de caja.
- Incluye productos por pieza, kilo y docena.
- Muestra una gráfica de ventas por cada uno de los últimos siete días para el encargado, junto con los reportes de semana, mes y año.
- Muestra ventas, ganancia bruta, gastos registrados y ganancia estimada después de gastos por semana, mes y año; los totales anuales incluyen meses archivados. Desde el historial, el encargado puede descargar las ventas detalladas conservadas en CSV; las ventas archivadas quedan en los resúmenes mensuales.
- Muestra en Resumen avisos de productos por reponer o con caducidad en los próximos 7 días; cada aviso abre el filtro correspondiente en Inventario.
- En Venta muestra accesos de un toque a los seis productos que más se han vendido en los últimos 30 días, cuando no hay búsqueda ni filtro de categoría activo.
- Al registrar un resurtido de un producto por debajo de su mínimo, propone la cantidad necesaria para llegar al mínimo; el encargado puede editarla antes de confirmar.
- Busca productos en Inventario por nombre, marca, detalle, contenido o código de barras. Muestra el historial de ventas, resurtidos, anulaciones y conteos por producto. En Resumen permite buscar tickets conservados por fecha, producto o forma de pago.
- Descarga en CSV el historial de compras y resurtidos, con cantidades, costos, proveedor, caducidad y operador.
- Importa y descarga el catálogo en CSV; al importar, las existencias no cambian y los productos nuevos comienzan en cero.
- Controla caducidad por lote: cada resurtido conserva su fecha, las ventas priorizan el lote que vence antes y las devoluciones pueden restaurar el lote original.
- Advierte en la cuenta cuando la cantidad rebasa las existencias registradas, sin impedir continuar si el conteo está pendiente de actualizar.
- Incluye una guía rápida de operación en Ajustes. El encargado puede crear PIN individuales para el personal, limitar las acciones administrativas y cambiar de operador sin cerrar la caja. Los PIN nuevos se guardan con sal y derivación PBKDF2 en los datos locales; no son cuentas en línea. El lector de cámara confirma lecturas consecutivas y ofrece zoom/luz cuando el dispositivo lo admite.
- Al cerrar caja, el conteo por denominación compara en vivo el efectivo contado con el esperado y señala coincidencias o diferencias antes de confirmar.
- En Reinversión resume el costo registrado de las compras de hoy y del mes, junto con el historial de proveedor y cambios de costo.
- Registra apertura, entradas, retiros, pagos a proveedores y gastos del negocio por separado. El corte muestra los gastos del turno; el resumen resta solo los gastos marcados como tales de la ganancia estimada.
- Exporta y restaura respaldos JSON. Antes de restaurar, descarga una copia de los datos actuales, valida las colecciones del archivo y evita reemplazar información durante una caja abierta.
- Resume ventas de más de un año por mes y guarda ingresos, costo, gastos, ganancia bruta, ganancia neta y número de tickets antes de retirar el detalle; solicita una confirmación y descarga un respaldo.
- Incluye una base PWA para instalación y caché de la interfaz.

La carpeta elegida es la copia operativa; mantén una copia de respaldo del archivo de datos. Los cobros con tarjeta o transferencia se procesan fuera de la app. La conexión directa de impresoras térmicas, cajones y básculas depende de sus modelos; se requiere confirmarlos antes de integrar. El lector de cámara depende del navegador y el dispositivo. La limpieza anual se inicia manualmente desde Resumen o Inventario para que el dueño controle cuándo archivar. Comprueba la cámara y la selección de carpeta en Chrome Android con HTTPS; el soporte depende del navegador y del dispositivo.
