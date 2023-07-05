# Arceliuz

El proyecto de Arceliuz fue creado por la nececidad de [Domiburguer](http://domiburguer.com/home "Domiburguer") (un negocio de hamburguesa artesanales a domiclios ultraveloces)  que queria un sistema personalisado en el que la eficiencia de recibir un pedido y entregarlo fuera automatisado y eficiente.

## Objetivo principal

Como objetivo primordial, es hacer un sistema en el que los clientes puedan hacer un pedido con un solo click. que sea lo mas facil y rapido posible , quitando del medio el tener que establecer una conversacion con el cliete , por cuaquier medio de comunicion direccta (whatsap, messeger, facebook, instagram , google maps, etc) , esto se hara con una leadPage, en el que un formulario mandara al servidor de arceliuz la informacion del pedido, esta la procesara y mandara ya sea una alerta , notificacion o evento al trabajador de recpcion o plancha , para que esto proceda con le pedio,
Como objetivo primordial, es hacer un sistema en el que los clientes puedan hacer un pedido con un solo click. que sea lo mas facil y rapido posible , quitando del medio el tener que establecer una conversacion con el cliete , por cuaquier medio de comunicion directa (whatsap, messeger, facebook, instagram , google maps, etc) , esto se hara con una leadPage, en el que un formulario mandara al servidor de arceliuz la informacion del pedido, esta la procesara y mandara ya sea una alerta , notificacion o evento al trabajador de recepcion o plancha , para que esto proceda con le pedio,

El formulario , para ser mas eficiente para le cliente, estara conectada con la api de [Google Maps Place Autocomplete](https://developers.google.com/maps/documentation/javascript/place-autocomplete?hl=es-419#javascript "Google Maps Place Autocomplete ") con esto le podremos poner un mapa de una direccion para que él pueda confirmar la ubiccion exacta.

Cuando se mande el pedido se enviara en forma de factura una pagina unica por medio de sms al numero que el cliente puso en el pedido. En la pagina esta la informacion de factura y estado del pedido ( procesando, cocinando , en espera , despachado y finalizada). incluira la informacion del domiciliario

Por el otro lado , el servidor procesara la informacion del pedido , con ayuda de una api , guardara al cliente en la base de datos con referencia al numero de celuta. con la direccion se buscara las cordenadas con ayuda de google maps api para que se pueda ver la ubicion de envio en un mapa , mapa que usara los trabajadores de recepcion y domicilirario podran terner una referncia de la distancia y ubicacion.

## Iniciar proyecto en desarrollo

para iniciar el proyecto en local nesecitamod intalar todas las librebias con: `npm i`, Luego instala Firebase CLI. Si aún no lo has hecho, mas [informacin](https://firebase.google.com/docs/emulator-suite/install_and_configure?hl=es-419) y luego ejecuta en la consola `npm run dev` esto iniciara el servidor de la base de datos y el servidor de arceliuz

## Requeriminiento de la leadPage

- Recibir los datos del pedido:
  - Nombre completo
  - Telefono
  - Direccion
  - Productos
  - forma de pago :
    - efectivo : Devuleta de cuanto
    - trasferencia : conectar la api de Nequi y Bancolombia
  - notas y comentarios
- Tener los servicios de google maps para hacer una busqueda de la direccion de manera facil
- mostrar la direccion en un mapa pequeño
- enviar todos los datos a la api
- conectarse con el sevicio de cupones y referidos
- dar respuesta de la compra al estilo de factura
- calcular la distancia del envio para dar un precio de domicilio en tiempo real
- conectar con los servicios de nequi y bancolombia para hacer cobros automaticos
