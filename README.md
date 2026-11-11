# La Tiendita · Punto de venta

Aplicación web para una tienda de abarrotes, adaptable a teléfono, tableta y computadora.

## Abrir la aplicación

Sirve la carpeta desde un servidor web local o de desarrollo en HTTPS. El selector de carpeta de Android requiere un navegador compatible y un contexto seguro. En Chrome de Android, abre **Elegir carpeta** y selecciona la carpeta donde guardar `tiendita-datos.json`.

Los lectores de código configurados como teclado pueden escribir en el campo de búsqueda; se agrega automáticamente el artículo cuando el lector envía el código completo. En Android, el botón Cámara usa el detector de códigos disponible en el navegador y solicita permiso para la cámara. Los productos por kilo solicitan el peso en gramos.

## Alcance de esta primera versión

- Elige una carpeta y guarda allí el inventario y el historial en `tiendita-datos.json`.
- Recupera los datos desde esa carpeta al volver a abrir la aplicación cuando el navegador conserva el permiso.
- Registra ventas en efectivo, calcula cambio y descuenta existencias.
- Permite anular una venta con PIN de encargado y motivo; conserva el ticket, repone existencias opcionalmente y registra reembolsos en efectivo como salida de caja.
- Incluye productos por pieza, kilo y docena.
- Muestra ventas y utilidad bruta estimada por día, semana, mes y año; los totales anuales incluyen meses archivados.
- Importa y descarga el catálogo en CSV; al importar, las existencias no cambian y los productos nuevos comienzan en cero.
- Controla caducidad por lote: cada resurtido conserva su fecha, las ventas priorizan el lote que vence antes y las devoluciones pueden restaurar el lote original.
- Advierte en la cuenta cuando la cantidad rebasa las existencias registradas, sin impedir continuar si el conteo está pendiente de actualizar.
- Registra apertura, entradas y salidas de efectivo y corte de caja.
- Exporta y restaura respaldos JSON.
- Resume ventas de más de un año por mes y guarda ingresos, costo, utilidad y número de tickets antes de retirar el detalle; solicita una confirmación y descarga un respaldo.
- Incluye una base PWA para instalación y caché de la interfaz.

La carpeta elegida es la copia operativa; mantén una copia de respaldo del archivo de datos. La limpieza anual se inicia manualmente desde Resumen o Inventario para que el dueño controle cuándo archivar. Comprueba la cámara y la selección de carpeta en Chrome Android con HTTPS; el soporte depende del navegador y del dispositivo.
