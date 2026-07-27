<h1 align="center"> 🖨️ FacturImprenta - Sistema de Gestión y Cotización de Imprenta ⚙️ </h1>

<p align="center">
  <img width="600" height="590" alt="amigo secreto" src="frontend/public/logo.png" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/STATUS-Active-brightgreen?style=for-the-badge"> &nbsp;
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular"> &nbsp; 
  <img src="https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21"> &nbsp; 
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot"> &nbsp; 
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"> &nbsp;
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"> &nbsp;
</p>

---

## 📝 Descripción del Proyecto

FacturImprenta es un sistema de gestión empresarial y cotizador simplificado diseñado para imprentas. Permite administrar el flujo comercial y productivo del negocio: desde el registro de clientes y la cotización dinámica de servicios (según materiales y acabados), hasta el seguimiento en tiempo real del estado de producción y los pagos.

El sistema sigue una arquitectura desacoplada:
*   **Frontend (Angular 21):** Interfaz SPA intuitiva y reactiva inspirada en texturas de papel y marcas de corte para operarios y gerentes.
*   **Backend (Java 21 / Spring Boot):** API REST robusta que maneja las reglas de negocio, persistencia relacional en PostgreSQL y la seguridad mediante tokens criptográficos JWT.

---

## 🛠️ Tecnologías Utilizadas

### Frontend (Cliente Web)
| Tecnología | Propósito | Características Clave |
| :--- | :--- | :--- |
| **Angular 21** | Framework Core | Arquitectura reactiva con Signals, inyección de dependencias y `rxResource` para optimizar flujos asíncronos. |
| **Spartan UI** | Biblioteca UI | Componentes accesibles e interactivos (Hlm & Brain) basados en Shadcn UI. |
| **Tailwind CSS** | Estilos visuales | Diseño adaptativo con clases de utilidad y variables CSS de marca. |
| **Vitest** | Suite de Pruebas | Ejecución ultra veloz de tests unitarios en reemplazo de Karma. |

### Backend (Servicios REST)
| Tecnología | Propósito | Características Clave |
| :--- | :--- | :--- |
| **Java 21** | Lenguaje de desarrollo | Uso de características modernas de Java (records, pattern matching, etc.). |
| **Spring Boot 4** | Framework Backend | Núcleo de la API REST ágil, modular y listo para la nube. |
| **Spring Security** | Autenticación y Autorización | Seguridad robusta a nivel de endpoints con filtrado de tokens **JWT**. |
| **Spring Data JPA** | Acceso a Datos | Mapeo ORM para la persistencia relacional en la base de datos PostgreSQL. |
| **OpenAPI / Swagger** | Documentación de API | Auto-generación y documentación viva de endpoints con interfaz interactiva. |
| **Lombok** | Boilerplate Minimizer | Reducción de código repetitivo mediante anotaciones de constructores, getters y setters. |

---

## 🗺️ Arquitectura de Rutas y Roles en el Frontend

El acceso al portal web está condicionado por roles (`admin` y `user`) controlados mediante Guards en Angular:

| Vista | Ruta Frontend | Rol Requerido | Propósito |
| :--- | :--- | :--- | :--- |
| **Acceso Seguro** | `/login` | Público | Autenticación inicial del personal con credenciales. |
| **Dashboard** | `/dashboard` | `user` / `admin` | Gráficos de ingresos, métricas y cola de pedidos recientes. |
| **Cotizador** | `/cotizador` | `user` / `admin` | Calculadora interactiva de costos por ítem, material y acabados. |
| **Ficha de Pedido** | `/pedidos/:id` | `user` / `admin` | Detalle, facturación y actualización de estado de producción del pedido. |
| **Catálogo** | `/admin/catalogo` | Solo `admin` | Altas, bajas y modificaciones de materiales, acabados y tarifas base. |
| **Usuarios** | `/admin/usuarios` | Solo `admin` | Gestión del personal interno que accede al sistema. |
| **Clientes** | `/clientes` | `user` / `admin` | Base de datos de clientes para el seguimiento del negocio. |

---

## 🏗️ Arquitectura y Capas del Backend

El backend se ha estructurado bajo un diseño de arquitectura por capas (Layered Architecture), lo que promueve una clara separación de responsabilidades y un bajo acoplamiento:

| Capa / Paquete | Responsabilidad Principal | Clases / Conceptos Clave |
| :--- | :--- | :--- |
| **Controladores (`controller/`)** | **Exposición REST & Validación**<br>Recibe solicitudes HTTP del cliente, valida los datos iniciales de entrada y delega el flujo a la capa de servicio. | Anotaciones `@RestController`, `@GetMapping`, `@PostMapping`, `@Valid`. |
| **Servicios (`service/`)** | **Lógica y Reglas de Negocio**<br>Contiene las reglas de negocio del sistema de imprenta (procesamiento de cotizaciones, validaciones financieras, actualización de estados de pedidos). | Interfaces y sus implementaciones anotadas con `@Service`. |
| **Repositorios (`repository/`)** | **Persistencia y Acceso a Datos**<br>Define el mapeo de operaciones de bases de datos. Permite ejecutar consultas directas de forma abstracta. | Interfaces que heredan de `JpaRepository` (Spring Data JPA). |
| **Modelos (`model/`)** | **Entidades de Dominio**<br>Representa las tablas de la base de datos relacional PostgreSQL en el código. | Clases anotadas con `@Entity`, `@Table`, `@Id`, relaciones `@ManyToOne`. |
| **DTOs (`dto/`)** | **Intercambio Seguro de Datos**<br>Estructuras que desacoplan la persistencia física (JPA) de la interfaz de la API. Evitan exponer campos sensibles del modelo. | Clases Request/Response y uso de Java `record` para inmutabilidad. |
| **Seguridad (`security/`)** | **Autenticación e Intercepción**<br>Filtra peticiones entrantes para leer tokens JWT, establece el contexto de seguridad de Spring Security y maneja políticas CORS. | `JwtAuthenticationFilter`, `SecurityConfig`, roles (`ROLE_ADMIN`). |
| **Excepciones (`exception/`)** | **Manejo Centralizado de Errores**<br>Maneja errores de forma global capturando fallos y retornando un JSON con formato amigable y el código HTTP preciso. | Clases `@RestControllerAdvice`, `@ExceptionHandler`. |

---

## 🔌 API REST (Endpoints del Backend y Seguridad)

El backend de Spring Boot expone servicios modulares mediante API REST. A continuación se detallan las rutas, los métodos HTTP y las restricciones de acceso basadas en roles:

| Módulo | Método | Ruta (Endpoint) | Seguridad (Rol) | Descripción |
| :--- | :---: | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/login` | Público | Autenticación y generación de token de sesión JWT. |
| **Pedidos** | `GET` | `/api/pedidos` | Autenticado (`USER`/`ADMIN`) | Obtiene la lista completa de pedidos. |
| | `GET` | `/api/pedidos/{id}` | Autenticado (`USER`/`ADMIN`) | Detalle técnico y estado financiero de un pedido. |
| | `GET` | `/api/pedidos/estado` | Autenticado (`USER`/`ADMIN`) | Filtra los pedidos según su estado de producción. |
| | `POST` | `/api/pedidos` | Autenticado (`USER`/`ADMIN`) | Registra un nuevo pedido en el sistema. |
| | `PATCH` | `/api/pedidos/{id}/estado` | Autenticado (`USER`/`ADMIN`) | Transición de fase productiva de un pedido. |
| **Cotización** | `POST` | `/api/cotizaciones` | Autenticado (`USER`/`ADMIN`) | Calcula el presupuesto estimado de impresión de manera dinámica. |
| **Materiales** | `GET` | `/api/materiales` | Autenticado (`USER`/`ADMIN`) | Listado de los materiales en el catálogo base de imprenta. |
| | `GET` | `/api/materiales/{id}` | Autenticado (`USER`/`ADMIN`) | Obtiene el detalle de un material. |
| | `POST` | `/api/materiales` | Solo **`ADMIN`** | Registra un nuevo tipo de material y su costo por cm². |
| | `DELETE` | `/api/materiales/{id}` | Solo **`ADMIN`** | Elimina permanentemente un material del catálogo. |
| **Acabados** | `GET` | `/api/acabados` | Autenticado (`USER`/`ADMIN`) | Listado de acabados de impresión disponibles. |
| | `GET` | `/api/acabados/{id}` | Autenticado (`USER`/`ADMIN`) | Obtiene información de un acabado específico. |
| | `POST` | `/api/acabados` | Solo **`ADMIN`** | Registra una nueva técnica de acabado y su tarifa. |
| | `DELETE` | `/api/acabados/{id}` | Solo **`ADMIN`** | Elimina permanentemente una técnica de acabado. |
| **Clientes** | `GET` | `/api/clientes` | Autenticado (`USER`/`ADMIN`) | Listado completo de la cartera de clientes. |
| | `GET` | `/api/clientes/{id}` | Autenticado (`USER`/`ADMIN`) | Ficha de contacto y detalles de un cliente. |
| | `POST` | `/api/clientes` | Autenticado (`USER`/`ADMIN`) | Registra un nuevo cliente en el sistema. |
| | `DELETE` | `/api/clientes/{id}` | Solo **`ADMIN`** | Elimina un cliente de la base de datos. |
| **Pagos** | `GET` | `/api/pedidos/{idPedido}/pagos` | Autenticado (`USER`/`ADMIN`) | Listado histórico de abonos y deudas de un pedido. |
| | `POST` | `/api/pedidos/{idPedido}/pagos` | Autenticado (`USER`/`ADMIN`) | Registra un nuevo pago/abono sobre un pedido pendiente. |
| **Usuarios** | `GET` | `/api/usuarios` | Solo **`ADMIN`** | Obtiene el listado de todo el personal registrado. |
| | `GET` | `/api/usuarios/{id}` | Solo **`ADMIN`** | Consulta detalles de perfil del personal interno. |
| | `POST` | `/api/usuarios` | Solo **`ADMIN`** | Registra un nuevo usuario del sistema asignando rol. |
| | `DELETE` | `/api/usuarios/{id}` | Solo **`ADMIN`** | Elimina la cuenta y revoca el acceso de un usuario. |

> [!NOTE]
> Una vez levantado el backend, puedes acceder a la consola interactiva de **Swagger UI** en:
> `http://localhost:8080/swagger-ui/index.html` para interactuar con los endpoints y probar peticiones en vivo.

---

## 📂 Estructura del Repositorio Completo

La organización general del proyecto integra tanto el backend (Spring Boot) como el frontend (Angular):

```text
proyecto-printing/
├── backend/                         # Backend en Java con Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/printing/managment/
│   │   │   │   ├── controller/      # Controladores REST expuestos al cliente
│   │   │   │   ├── model/           # Entidades JPA mapeadas a PostgreSQL
│   │   │   │   ├── repository/      # Interfaces de acceso a base de datos
│   │   │   │   ├── service/         # Clases de lógica de negocio y reglas comerciales
│   │   │   │   ├── dto/             # Data Transfer Objects para transferencias seguras
│   │   │   │   ├── security/        # Filtros JWT y configuraciones de Spring Security
│   │   │   │   └── exception/       # Manejo centralizado de excepciones de negocio
│   │   │   └── resources/
│   │   │       └── application.properties  # Configuración (DB Neon, JWT, variables)
│   │   └── test/                    # Pruebas unitarias e integración de JUnit/MockMvc
│   ├── pom.xml                      # Archivo de configuración de dependencias de Maven
│   └── mvnw                         # Maven Wrapper para entornos Linux/macOS y Windows (.cmd)
│
└── frontend/                        # Frontend en Angular 21
    ├── src/
    │   ├── app/
    │   │   ├── core/                # Elementos globales (guards, interceptores, modelos, servicios HTTP)
    │   │   ├── features/            # Vistas agrupadas modularmente (auth, dashboard)
    │   │   ├── shared/              # Pipes para estados, directivas y utilidades compartidas
    │   │   └── components/          # Componentes reutilizables integrados con Spartan UI
    │   ├── environments/            # Parámetros del entorno de producción y desarrollo (API Url)
    │   └── index.html               # Archivo HTML raíz
    ├── angular.json                 # Configuración de build de Angular CLI
    └── package.json                 # Scripts de desarrollo y dependencias npm
```

---

## ▶️ Instalación y Ejecución Local

Para replicar y desplegar el sistema localmente, sigue los siguientes pasos:

### 1. Levantar el Backend (Spring Boot)

#### Requisitos Previos:
*   Java Development Kit (JDK) 21 instalado.
*   Base de datos PostgreSQL activa (o usar el servicio Neon Cloud configurado en properties).

#### Pasos:
1. Navega al directorio del backend:
   ```bash
   cd backend
   ```
2. Configura las siguientes variables de entorno en tu sistema operativo o entorno de ejecución:
   *   `DB_URL`: Tu url de PostgreSQL.
   *   `DB_USERNAME`: Tu usuario de PostgreSQL.
   *   `DB_PASSWORD`: Tu contraseña de PostgreSQL.
   *   `JWT_SECRET`: Llave secreta para firmar tokens JWT de forma segura.
3. Ejecuta la aplicación de Spring Boot:
   ```bash
   # En Windows:
   mvnw.cmd spring-boot:run
   
   # En Linux/macOS:
   ./mvnw spring-boot:run
   ```

---

### 2. Levantar el Frontend (Angular)

#### Requisitos Previos:
*   Node.js (versión 18 o superior).
*   Angular CLI instalado globalmente (`npm install -g @angular/cli`).

#### Pasos:
1. Ingresa a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala los paquetes y dependencias requeridas:
   ```bash
   npm install
   ```
3. Verifica la configuración en `src/environments/environment.ts` para que apunte al puerto del backend (por defecto `http://localhost:8080/api`).
4. Inicia el servidor de desarrollo local:
   ```bash
   npm run start
   ```
5. Abre en tu navegador la dirección `http://localhost:4200/`.

#### Comandos Útiles del Frontend

| Comando | Acción |
| :--- | :--- |
| `npm run start` | Levanta el servidor local con recarga en caliente. |
| `npm run build` | Genera los archivos optimizados para producción en la carpeta `/dist`. |
| `npm run test` | Ejecuta las pruebas unitarias usando **Vitest**. |

---

## 👤 Autor

| [<img src="https://github.com/user-attachments/assets/ed62fad0-2a7e-4029-8525-2eec5c620be3" width="155"><br><sub>Andrio Contreras</sub>](https://github.com/DranxFa) |
| :---: |

---

## 📌 Estado del Proyecto

✅ **Finalizado** — MVP funcional completo con arquitectura desacoplada Frontend-Backend y persistencia en base de datos.
