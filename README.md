# La Tiendita · Punto de venta

Primera versión de la aplicación web para una tienda de abarrotes. La interfaz se adapta a teléfono, tableta y computadora; incluye una venta básica, inventario de ejemplo y resumen diario.

## Abrir la aplicación

Sirve la carpeta desde un servidor web local o de desarrollo en HTTPS. El selector de carpeta de Android requiere un navegador compatible y un contexto seguro. En Chrome de Android, abre **Elegir carpeta** y selecciona la carpeta donde guardar `tiendita-datos.json`.

Los lectores de código configurados como teclado pueden escribir en el campo de búsqueda; se agrega automáticamente el artículo cuando el lector envía el código completo. Los productos por kilo solicitan el peso en gramos.

## Alcance de esta primera versión

- Elige una carpeta y guarda allí el inventario y el historial en `tiendita-datos.json`.
- Recupera los datos desde esa carpeta al volver a abrir la aplicación cuando el navegador conserva el permiso.
- Registra ventas en efectivo, calcula cambio y descuenta existencias.
- Incluye productos por pieza, kilo y docena.
- Muestra ventas y utilidad bruta estimada del día.
- Incluye una base PWA para instalación y caché de la interfaz.

Esta primera entrega es un prototipo local: todavía no incluye escaneo con cámara, cortes de caja, respaldos importables ni resumen anual con limpieza verificada. La carpeta elegida es la copia operativa; mantén una copia de respaldo del archivo de datos.
