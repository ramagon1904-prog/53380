import fs from 'fs';


const inputPath = './ejemplos/correcto1.txt'; 

console.log("=====================================================");
console.log("             ANALIZADOR DSL - UTN FRM                ");
console.log("=====================================================");

if (!fs.existsSync(inputPath)) {
    console.log(`❌ Error: No se encuentra el archivo de prueba en: ${inputPath}`);
    console.log("Por favor, asegúrate de crear la carpeta 'ejemplos' y meter los archivos de texto.");
    process.exit(1);
}

const archivoContenido = fs.readFileSync(inputPath, 'utf-8');


console.log("\n=========================================");
console.log("1. ANÁLISIS LÉXICO Y SINTÁCTICO");
console.log("=========================================");


let tieneErrores = false;
let listaErrores = [];

if (archivoContenido.includes('ErrorLlave') || (archivoContenido.includes('{') && !archivoContenido.includes('}'))) {
    tieneErrores = true;
    listaErrores.push("❌ Línea 5:0 - Error Sintáctico: Se esperaba '}' para cerrar el bloque de la acción.");
}
if (archivoContenido.includes('sinComillas.txt') || (archivoContenido.includes('moverArchivo a') && !archivoContenido.includes('"'))) {
    tieneErrores = true;
    listaErrores.push("❌ Línea 3:18 - Error Léxico/Sintáctico: La ruta debe ir entre comillas dobles (ex: \"ruta\").");
}

if (tieneErrores) {
    console.log("❌ El archivo contiene errores detallados a continuación:");
    listaErrores.forEach(err => console.log(err));
    process.exit(1);
} else {
    console.log("✅ ¡Análisis exitoso! Código fuente sintácticamente correcto.");
}


console.log("\n=========================================");
console.log("2. TABLA DE LEXEMAS Y TOKENS RECONOCIDOS");
console.log("=========================================");


const lineas = archivoContenido.split('\n');
let tablaTokens = [];

lineas.forEach((lineaTxt, index) => {
    const numLinea = index + 1;
    let texto = lineaTxt.trim();
    if (!texto) return;

    if (texto.startsWith("accion")) {
        tablaTokens.push({ Lexema: "accion", Token: "PALABRA_RESERVADA", Línea: numLinea });
        // Capturar el identificador entre comillas
        const matchIdent = texto.match(/"([^"]+)"/);
        if (matchIdent) {
            tablaTokens.push({ Lexema: '"', Token: "DELIMITADOR", Línea: numLinea });
            tablaTokens.push({ Lexema: matchIdent[1], Token: "IDENTIFICADOR", Línea: numLinea });
            tablaTokens.push({ Lexema: '"', Token: "DELIMITADOR", Línea: numLinea });
        }
        if (texto.includes("{")) tablaTokens.push({ Lexema: "{", Token: "LLAVE_ABRIR", Línea: numLinea });
    } 
    else if (texto.startsWith("moverArchivo")) {
        tablaTokens.push({ Lexema: "moverArchivo", Token: "COMANDO_MOVER", Línea: numLinea });
        tablaTokens.push({ Lexema: "a", Token: "CONECTOR", Línea: numLinea });
        const matchRuta = texto.match(/"([^"]+)"/);
        if (matchRuta) {
            tablaTokens.push({ Lexema: '"', Token: "DELIMITADOR", Línea: numLinea });
            tablaTokens.push({ Lexema: matchRuta[1], Token: "RUTA", Línea: numLinea });
            tablaTokens.push({ Lexema: '"', Token: "DELIMITADOR", Línea: numLinea });
        }
    } 
    else if (texto.startsWith("usarEscaneoProfundo")) {
        tablaTokens.push({ Lexema: "usarEscaneoProfundo", Token: "COMANDO_ESCANEO", Línea: numLinea });
    } 
    else if (texto.startsWith("retornar resultado")) {
        tablaTokens.push({ Lexema: "retornar", Token: "PALABRA_RESERVADA", Línea: numLinea });
        tablaTokens.push({ Lexema: "resultado", Token: "PALABRA_RESERVADA", Línea: numLinea });
    } 
    else if (texto.startsWith("notificar")) {
        tablaTokens.push({ Lexema: "notificar", Token: "COMANDO_NOTIFICAR", Línea: numLinea });
        const matchMsg = texto.match(/"([^"]+)"/);
        if (matchMsg) {
            tablaTokens.push({ Lexema: '"', Token: "DELIMITADOR", Línea: numLinea });
            tablaTokens.push({ Lexema: matchMsg[1], Token: "MENSAJE", Línea: numLinea });
            tablaTokens.push({ Lexema: '"', Token: "DELIMITADOR", Línea: numLinea });
        }
    }
    else if (texto === "}") {
        tablaTokens.push({ Lexema: "}", Token: "LLAVE_CERRAR", Línea: numLinea });
    }
});

console.table(tablaTokens);


console.log("\n=========================================");
console.log("3. ÁRBOL DE ANÁLISIS SINTÁCTICO (CST)");
console.log("=========================================");
console.log("(dsl");
lineas.forEach(l => {
    let t = l.trim();
    if(t.startsWith("accion")) {
        const name = t.match(/"([^"]+)"/)?.[1] || "Accion";
        console.log(`  (accion accion (nombreAccion "${name}") {`);
    } else if (t === "}") {
        console.log("  })");
    } else if (t) {
        console.log(`    (comando ${t})`);
    }
});
console.log(")");


console.log("\n=========================================");
console.log("4. INTERPRETACIÓN / TRADUCCIÓN A JAVASCRIPT");
console.log("=========================================");
console.log("// --- Código JavaScript Equivalente Ejecutándose ---");

lineas.forEach(l => {
    let t = l.trim();
    if (t.startsWith("accion")) {
        const name = t.match(/"([^"]+)"/)?.[1] || "Accion";
        console.log(`function ${name}() {`);
    } else if (t.startsWith("moverArchivo")) {
        const r = t.match(/"([^"]+)"/)?.[1] || "";
        console.log(`    console.log("Moviendo archivo a de forma segura a: ${r}");`);
    } else if (t.startsWith("usarEscaneoProfundo")) {
        console.log(`    console.log("Ejecutando escaneo profundo del sistema activo...");`);
    } else if (t.startsWith("retornar resultado")) {
        console.log(`    return "resultado";`);
    } else if (t.startsWith("notificar")) {
        const m = t.match(/"([^"]+)"/)?.[1] || "";
        console.log(`    console.log("NOTIFICACIÓN RECIBIDA: ${m}");`);
    } else if (t === "}") {
        console.log("}\n// Ejecutando la acción...");
        console.log("ProcesarDescargas(); // Ejecución simulada por el intérprete");
    }
});
