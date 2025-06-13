# 🛒 Sistema de Gestión de Productos - Reto Técnico Merkuria

Este proyecto fue desarrollado como parte del reto técnico para la vacante de Jr. Developer en **Merkuria**. El sistema permite gestionar productos, usuarios y ventas utilizando tecnologías modernas y un backend basado en servicios BaaS (Backend as a Service) de Firebase.

El enfoque principal fue implementar una solución funcional, limpia y segura, integrando operaciones CRUD completas, filtros avanzados, autenticación, roles de usuario y visualización de datos mediante gráficas interactivas. También se consideró la experiencia del usuario en distintos dispositivos, asegurando una interfaz responsiva.

---

🔗 **Aplicación en línea:**  
https://gestionarproductos-v2.web.app

Usuario para iniciar sesión:
 - Correo: admin@demo.com

 - Contraseña: 123456

📁 **Repositorio del proyecto:**  
https://github.com/RCharles99/gestionar-productos.git

---


Desarrollador

Nombre: Roberto Carlos Flores Ranulfo

Nivel: Recién egresado, Ingeniería en TI área Entornos Virtuales y Negocios Digitales

Correo: carloshiky6192@gmail.com



Tecnologías utilizadas

HTML, CSS, JavaScript ES Modules

Bootstrap 5

Firebase (Auth, Firestore, Storage)

SweetAlert2

Chart.js

Visual Studio Code + Live Server


Funcionalidades del sistema web

 - Registro y login de usuarios con privilegios por rol

 - Alta, edición, eliminación y consulta de productos

 - Gestión de ventas con registro automático

 - Gráficos de inventario y ventas con filtros dinámicos

 - Seguridad por sesión activa y control de permisos

 - Interfaz responsive adaptada para dispositivos móviles


Estructura del BaaS (Firebase)

El sistema utiliza Firebase como Backend-as-a-Service (BaaS), y se ha configurado con los siguientes servicios:

🔸 Firestore

Colección productos:

name (string): Nombre del producto

category (string): Categoría

price (number): Precio

rating (number): Calificación (1-5)

stock (number): Stock disponible

imageUrl (string): URL de la imagen en Firebase Storage

createdAt (timestamp)

updatedAt (timestamp)


Colección ventas:

folio (string): Ej. "V001"

producto (string)

categoria (string)

vendidoPor (string)

cantidad (number)

precioUnidad (number)

total (number)

fecha (timestamp)


Colección usuarios:

nombreCompleto (string)

usuario (string)

correo (string)

estado (string): Activo / Inactivo

rol (string): Uno de los siguientes:

 - Nuevo Empleado

 - Vendedor

 - Encargado

 - Administrador Principal

Control de acceso por roles
  ___________________________________________________________________________________________________
 
| Rol                     | Permisos                                                                  |
| ----------------------- | ------------------------------------------------------------------------- |
| Nuevo Empleado          | Puede registrar y editar productos                                        |
| Vendedor                | Puede registrar, editar y vender productos                                |
| Encargado               | Tiene acceso total excepto gestión de usuarios                            |
| Administrador Principal | Acceso total al sistema, incluyendo gestión de usuarios y configuraciones |
  ___________________________________________________________________________________________________


🔸 Firebase Storage
Carpeta imagenes/: Contiene las imágenes de los productos.

🔸 Firebase Auth
Manejo de autenticación con correo y contraseña.

Restricciones según estado (Activo / Inactivo) y rol del usuario.

🔸 Reglas de seguridad (ejemplo recomendado)

// Firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

// Storage
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /imagenes/{allImages=**} {
      allow read, write: if request.auth != null;
    }
  }
}



Pruebas realizadas

Durante el desarrollo del sistema se realizaron pruebas manuales exhaustivas para validar el correcto funcionamiento de todas las funcionalidades principales. Las pruebas se llevaron a cabo utilizando el navegador web (Google Chrome) con la herramienta Live Server de Visual Studio Code.

Se verificaron los siguientes escenarios:

✔️ Registro, inicio de sesión y cierre de sesión de usuarios con diferentes roles.

✔️ Acceso restringido según el rol a páginas y funciones sensibles (como eliminación de productos o gestión de usuarios).

✔️ Registro, edición y eliminación de productos, incluyendo la carga y reemplazo de imágenes.

✔️ Aplicación de filtros de búsqueda y combinación de filtros en la tabla de productos.

✔️ Paginación funcional incluso con filtros activos.

✔️ Registro correcto de ventas con restricción por cantidad de stock.

✔️ Visualización de gráficos con filtros aplicables (por categoría, por cantidad, por porcentaje).

✔️ Exportación de datos en PDF de los gráficos (reportes).

✔️ Respuesta visual adecuada: mensajes de éxito o error y validaciones.



Uso de Asistentes de Codificación con IA

Este proyecto fue desarrollado por un egresado sin experiencia previa en programación profesional. Durante el proceso, se utilizó **ChatGPT (versión gratuita)** como herramienta de aprendizaje y desarrollo para:

- Entender los conceptos básicos de **Firebase** (Firestore, Auth, Storage) desde cero
- Generar código JavaScript, HTML y CSS para implementar funcionalidades específicas
- Aprender cómo conectar el frontend con la base de datos y estructurar operaciones CRUD
- Recibir orientación paso a paso para construir un sistema completo con roles, autenticación y gestión de datos
- Mejorar la interfaz visual y la experiencia de usuario con el uso de **SweetAlert2** y **Chart.js**

Aunque todo el código fue asistido por la IA, **la planificación, organización, diseño de la estructura, flujo de navegación y objetivos funcionales del sistema fueron definidos personalmente** por mí. Cada línea fue entendida en su propósito general y ajustada para que el sistema cumpliera con los requisitos del reto.

Este enfoque me permitió no solo construir el sistema funcional, sino también **adquirir habilidades reales de desarrollo** en el proceso.



---¿Cómo ejecutar el sistema de manera local?---

1. Abre el proyecto en Visual Studio Code

2. Instala la extensión Live Server

3. Abrir la carpeta "gestionProductos" en VS Code y haz clic derecho sobre index.html y selecciona "Open with Live Server"

4. El sistema se abrirá automáticamente en tu navegador

5. Ya puedes iniciar sesión o registrar usuarios
 
  - Perfil ya registrado:
     Correo: admin@demo.com
     Contraseña: 123456

Este sistema funciona sin servidor backend tradicional. Firebase se encarga de autenticar, almacenar y consultar todos los datos.


Configurar Firebase con una nueva cuenta

Por defecto, el sistema está conectado a un proyecto de Firebase del desarrollador.
Si deseas usar tu propia cuenta de Firebase, sigue estos pasos:

1. Crear un nuevo proyecto en Firebase

 - Ve a: https://console.firebase.google.com

 - Crea un proyecto

 - Registra una app web dentro del proyecto


2. Activar los servicios necesarios

 - Authentication (habilita método de correo y contraseña)

 - Firestore Database

 - Firebase Storage


3. Reemplazar la configuración de conexión

 - Copia el bloque firebaseConfig generado y pégalo en: /DB/firebaseConfig.js


4. Reglas temporales (modo desarrollo o prueba)

Firestore
 
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}


Storage

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}


Registro de Usuarios con Sesión Activa

Para evitar que se cierre la sesión del usuario actual al registrar un nuevo usuario, se implementó una estrategia basada en una instancia secundaria de Firebase. Esto permite utilizar una autenticación temporal exclusivamente para el proceso de registro, sin afectar la sesión activa de quien está usando el sistema.

¿Cómo funciona?
Se creó una segunda app de Firebase llamada "iniciarSesion" dentro del mismo proyecto de Firebase.

En el archivo firebaseConfig.js, se incluyó una función:

export function getSecondaryAuth() {
  const secondaryApp = initializeApp(firebaseConfig, "Secondary");
  return getAuth(secondaryApp);
}

Esta instancia secundaria permite registrar nuevos usuarios usando createUserWithEmailAndPassword() sin desconectar al usuario que está en sesión.

Luego de registrar al usuario, se cierra la sesión secundaria para evitar conflictos y mantener seguridad.

⚠️ Importante
Esta estrategia es necesaria para el correcto funcionamiento del registro en entornos locales o protegidos, donde cada acción de autenticación puede afectar la sesión global.

La segunda app "iniciarSesion" no necesita estar vinculada al hosting.



Crear Primer Usuario (Inicialización del Sistema)

Para facilitar la primera ejecución del sistema en entornos nuevos de manera local, se implementó un botón especial llamado "Crear Primer Usuario", ubicado en la página de inicio de sesión (index.html).

¿Por qué es necesario?
Este sistema está protegido mediante autenticación con Firebase y control de roles, por lo que:

 - Si se configura una nueva base de datos desde cero

 - Y aún no existe ningún usuario registrado

 - No sería posible acceder al sistema sin antes crear un usuario válido.


¿Qué hace el botón?
Al presionar el botón "Crear Primer Usuario", el sistema:

Verifica si existen usuarios registrados en la colección usuarios de Firestore.

Si no hay ningún usuario, automáticamente:

Crea un usuario en Firebase Authentication con:

 - Correo: admin@demo.com

 - Contraseña: 123456

Registra al usuario en Firestore con los siguientes datos:

 - nombreCompleto: Administrador de Prueba

 - usuario: admin

 - correo: admin@demo.com

 - contraseña: 123456

 - estado: Activo

 - rol: Administrador Principal

Muestra un mensaje con las credenciales para iniciar sesión.


Enlace con capturas del sistema y configuración detallada de la base de datos

Contiene capturas del sistema (manual de usuario): 
https://drive.google.com/drive/folders/1A9xl8WaUqE0JN-dgKYYRkIXbkonKo2Xs?usp=sharing





