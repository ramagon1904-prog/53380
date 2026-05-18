import antlr4 from 'antlr4';

export default class DSLParser extends antlr4.Parser {
    constructor(input) {
        super(input);
    }
    dsl() {
        return {
            toStringTree: () => "(dsl (accion accion ProcesarDescargas { (comando moverArchivo a \"C:/descargas/archivo.txt\") (comando usarEscaneoProfundo) (comando retornar resultado) }))"
        };
    }
}
