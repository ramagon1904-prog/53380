grammar dsl;


dsl      : accion+ EOF ;

accion   : 'accion' nombreAccion '{' comando+ '}' ;

nombreAccion : '"' IDENTIFICADOR '"' ;

comando  : 'moverArchivo' 'a' '"' RUTA '"'
         | 'usarEscaneoProfundo'
         | 'retornar' 'resultado'
         | 'notificar' '"' MENSAJE '"'
         ;


IDENTIFICADOR : LETRA (LETRA | DIGITO)* ;


RUTA        : CARACTER+ ;
MENSAJE     : CARACTER+ ;

fragment LETRA    : [a-zA-Z] ;
fragment DIGITO   : [0-9] ;
fragment CARACTER : [a-zA-Z0-9_\-\/\ ] ;


WS : [ \t\r\n]+ -> skip ;