# TP Analizador Sintáctico e Intérprete DSL - UTN FRM

Acá está el código del analizador léxico, sintáctico y el intérprete para el lenguaje (DSL) que nos tocó. Lo terminamos armando con **Node.js**.

## Qué hay en cada carpeta
- `proyecto-analizador/ejemplos/`: Acá adentro dejé los 4 casos de prueba para testear (2 que dan bien y 2 que tiran error sintáctico o léxico).
- `proyecto-analizador/DSL.g4`: El archivo con la gramática limpia.
- `proyecto-analizador/index.js`: El script principal que corre todo, genera las tablas de tokens, el árbol y el intérprete.

## Cómo hacerlo andar

1. **Bajar las librerías:**
   Abrí la terminal de VS Code adentro de la carpeta `proyecto-analizador` y tirá este comando para instalar lo que falta:
   ```bash
   npm install
2. **Correr el analizador:**
   Para probar el archivo que viene por defecto, poné:
   ```bash
   node index.js
```
Dato: si querés probar con otro de los archivos de ejemplo, cambiás la ruta en la variable inputPath que está en la línea 4 de index.js y listo.
---

## Notas del desarrollo / Lo que me costó
Al principio renegué bastante con la configuración de Java y los comandos de ANTLR que me tiraban error en Windows, por lo que preferí emular la lógica del Lexer y el Parser directo en los archivos JS para que sea más portable y corra de una con Node de forma simétrica. Los ejemplos de la carpeta de ejemplos prueban todos los casos del DSL.
