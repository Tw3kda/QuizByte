# QuizByte – Trivias personalizadas de videojuegos con IA

**QuizByte** es una aplicación móvil que genera **preguntas personalizadas sobre videojuegos** usando inteligencia artificial. Los usuarios pueden construir su propia biblioteca de juegos, y la IA generará trivias adaptadas a los títulos que han jugado. Además, puedes competir con otros jugadores en tiempo real y demostrar quién sabe más.

---

## Funcionalidades principales

- Generación de preguntas con IA según tus juegos favoritos
- Biblioteca personalizada de videojuegos
- Modo competitivo de 2 jugadores con puntuación en tiempo real
- Búsqueda de juegos e imágenes usando la base de datos de [IGDB](https://www.igdb.com/)
- Carga de fotos desde cámara  para analisis por IA (API de Gemini)
- Autenticación y registros con Firebase
- Lobbies privados mediante IDs unicos, compartibles por medio de  QR con `react-native-qrcode-svg`

---

**Sobre el Funcionamiento para el usuario consultar la wiki**

## Tecnologías utilizadas

- **React Native** con **Expo Go**
- `react-native-qrcode-svg` – para generar códigos QR
- `expo-camera` – para capturar imágenes desde la cámara del dispositivo
- **Firebase** – para autenticación y almacenamiento de datos de los jugadores
- **Gemini API** – para generación de contenido a partir de imágenes
- **IGDB API** – para obtener información e imágenes de videojuegos
- **Backend API** – lógica de busqueda de juegos por texto o imagenes usando gemini API e IGDB API
  *(ver más abajo)*

---

## Instalación y ejecución

```bash
git clone https://github.com/Tw3kda/QuizByte.git
cd QuizByte
npm install
npx expo start

```


## API backend

La lógica para conectarse a IGDB Y GEMINI para agregar videojuegos está manejada a través de una API desarrollada para este proyecto.

[Enlace al github de la API](https://github.com/Tw3kda/QuizByte_API.git)

Consulta más detalles en el README y Wiki de ese repositorio.
