# 🌸 Lara Pastelería

### Landing Page | React + Vite

Landing page desarrollada para **Lara Pastelería**, un emprendimiento gastronómico que combina pastelería clásica, opciones saludables y cafetería.

El proyecto tiene como objetivo crear un espacio digital atractivo, intuitivo y responsive, donde los clientes puedan conocer los productos, explorar el menú y acceder a un formulario de pedidos.

La aplicación fue desarrollada como proyecto de Frontend con React, utilizando componentes reutilizables, organización modular y control de versiones colaborativo.

---

## ✨ Funcionalidades

### 🌷 Inicio

- Presentación visual del emprendimiento.
- Animaciones e interacciones con productos destacados.
- Elementos gráficos personalizados.
- Adaptación de las animaciones para dispositivos móviles.

### 🍪 Menú de productos

- Visualización de productos mediante tarjetas.
- Organización por categorías:
  - Healthy / Fit.
  - Clásicos de pastelería.
  - Cafetería y bebidas.
- Información de productos vinculada al catálogo centralizado.
- Presentación responsive de categorías y tarjetas.
- Interacciones adaptadas a distintos dispositivos.

### 💌 Pedidos

- Formulario para ingresar información de pedidos.
- Interfaz adaptada a dispositivos móviles y computadoras.
- Recursos gráficos personalizados.
- Organización visual de los campos para facilitar su uso.

### 📍 Ubicación

- Sección con información de ubicación del emprendimiento.
- Integración con la estructura principal de la landing.

### 🌸 Footer

- Información de contacto.
- Elementos visuales relacionados con la identidad de la marca.
- Adaptación al diseño general del sitio.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|------------|-----|
| React | Desarrollo de componentes e interfaces |
| JavaScript / JSX | Lógica e interactividad |
| Vite | Entorno de desarrollo y compilación |
| CSS3 | Estilos, animaciones y diseño responsive |
| pnpm | Gestión de paquetes y dependencias |
| Git | Control de versiones |
| GitHub | Repositorio y trabajo colaborativo |

---

## 📁 Estructura del proyecto

```text
lara-pasteleria/
├── public/
├── src/
│   ├── assets/
│   │   ├── elementos/
│   │   └── menu/
│   ├── components/
│   │   ├── Header/
│   │   ├── Inicio/
│   │   ├── Separador/
│   │   ├── Menu/
│   │   │   ├── Menu.jsx
│   │   │   ├── Menu.css
│   │   │   ├── TarjetaProducto.jsx
│   │   │   └── TarjetaProducto.css
│   │   ├── Pedidos/
│   │   ├── Ubicacion/
│   │   └── Footer/
│   ├── data/
│   │   ├── catalogoLara.js
│   │   ├── productosMenu.js
│   │   └── configuracion.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── README.md
```

### Organización del código

- `components/`: componentes reutilizables de la interfaz.
- `assets/`: imágenes, ilustraciones y recursos gráficos.
- `data/`: información del catálogo, productos y configuración.
- `App.jsx`: integración de las secciones principales.
- `main.jsx`: punto de entrada de la aplicación.

---

## 🚀 Instalación y ejecución local

### Requisitos previos

Para ejecutar el proyecto es necesario contar con:

- Node.js instalado.
- pnpm instalado.
- Git.

### 1. Clonar el repositorio

```bash
git clone https://github.com/sofiimendo/lara-pasteleria.git
```

### 2. Ingresar al directorio

```bash
cd lara-pasteleria
```

### 3. Instalar las dependencias

El proyecto utiliza **pnpm** como gestor de paquetes.

```bash
pnpm install
```

### 4. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

Vite mostrará una dirección local para acceder a la aplicación desde el navegador.

Generalmente:

```text
http://localhost:5173/
```

Si ese puerto está ocupado, Vite utilizará otro disponible.

---

## 📦 Compilación para producción

Para generar una versión optimizada:

```bash
pnpm build
```

La compilación genera la carpeta:

```text
dist/
```

Esta carpeta contiene los archivos preparados para su publicación.

Para previsualizar la versión compilada:

```bash
pnpm preview
```

---

## 📱 Diseño responsive

La landing fue desarrollada para adaptarse a diferentes resoluciones y tamaños de pantalla.

Se realizaron ajustes específicos en:

- Header y navegación.
- Distribución y animaciones de Inicio.
- Menú y tarjetas de productos.
- Formulario de Pedidos.
- Espaciados, tamaños y disposición de elementos visuales.

El objetivo es mantener una experiencia consistente tanto en computadoras como en dispositivos móviles.

---

## 🧩 Arquitectura de componentes

La aplicación utiliza una estructura modular basada en componentes React.

La composición principal de `App.jsx` es:

```jsx
function App() {
  return (
    <>
      <Header />
      <main>
        <Inicio />
        <Separador />
        <Menu />
        <Pedidos />
        <Ubicacion />
      </main>
      <Footer />
    </>
  );
}
```

Esta organización permite mantener cada sección de manera independiente y facilita futuras modificaciones.

---

## 🍰 Gestión de productos

La información del menú se organiza mediante archivos de datos independientes de los componentes visuales.

### `catalogoLara.js`

Centraliza información del catálogo de productos.

### `productosMenu.js`

Organiza los productos que se muestran en el menú y establece su relación con el catálogo.

### `TarjetaProducto.jsx`

Componente encargado de presentar visualmente la información de cada producto.

Esta separación permite mantener los datos y la interfaz organizados, evitando duplicar información innecesariamente.

---

## 🔄 Trabajo colaborativo con Git y GitHub

El proyecto fue desarrollado mediante un flujo de trabajo colaborativo.

Se utilizaron:

- Ramas independientes para desarrollar funcionalidades.
- Commits descriptivos.
- Pull Requests para integrar cambios.
- Revisiones antes de realizar merges.
- Rama `main` como versión integrada del proyecto.

### Mejoras integradas

- Desarrollo y adaptación del Header.
- Implementación de Inicio y sus animaciones.
- Integración del Menú con el catálogo.
- Adaptación responsive de tarjetas y categorías.
- Actualización del formulario de Pedidos.
- Incorporación de Ubicación y Footer.
- Reorganización de `App.jsx`.
- Verificación de la compilación de producción.

---

## 🌐 Deploy

El proyecto está preparado para generar una compilación de producción con Vite utilizando:

```bash
pnpm build
```

La publicación del sitio está prevista en **Hostinger**.

Una vez realizado el despliegue, se podrá incorporar aquí la URL pública de Lara Pastelería.

**Estado actual:** pendiente de despliegue público.

---

## 🔮 Próximas funcionalidades

Como evolución del proyecto, se contempla la integración con **Lara Stock**, el sistema de gestión del emprendimiento.

Entre las funcionalidades previstas se encuentran:

- Envío de pedidos de la landing al backend.
- Administración y seguimiento de pedidos.
- Control de stock de ingredientes y productos terminados.
- Gestión de recetas y producciones.
- Registro de ventas presenciales y pedidos web.
- Seguimiento de ingresos, egresos y costos de producción.
- Integración con una base de datos MongoDB.

Estas funcionalidades forman parte de las próximas etapas del proyecto y no se consideran implementadas en la versión actual de la landing.

---

## 👩‍💻 Desarrolladoras

### 🌸 Sofía Mendoza
- GitHub: [@sofiimendo](https://github.com/sofiimendo)
- Desarrollo frontend y trabajo colaborativo.
- Desarrollo e implementación de componentes en React.

### 🎨 Yamila Valdez Aguilar
- Diseño de la landing page.
- Desarrollo e implementación de componentes en React.
- Adaptación responsive y mejoras de la interfaz.

---

Proyecto desarrollado por **Sofía Mendoza y Yamila Valdez Aguilar** en el marco de la formación en **Desarrollo Frontend con React**.

---

## 📌 Estado del proyecto

**Frontend integrado en `main`.**

- Componentes principales implementados.
- Diseño responsive incorporado.
- Menú conectado con el catálogo de productos.
- Compilación de producción verificada.
- Despliegue público pendiente.
- Integración con Lara Stock planificada.

---

### 🌸 Lara Pastelería

*Opciones saludables, clásicas & cafecitos.*