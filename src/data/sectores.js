// Contenido por sector: sobreescribe escenario, texto e impacto de cada ronda.
// El motor (tipo, componentes) permanece idéntico para todos los sectores.
export const SECTORES = {
  salud: {
    id: 'salud',
    emoji: '🏥',
    nombre: 'Salud',
    color: '#10b981',
    reto_central: 'Proteja vidas protegiendo los datos del paciente',
    rondas: [
      {
        escenario: 'Su personal médico necesita acceder a historiales clínicos desde cualquier área del hospital.',
        opciones: [
          { texto: 'Equipamos cada área con dispositivos estandarizados y seguros', impacto: 'El equipo médico trabaja sin improvisaciones ni riesgos' },
          { texto: 'Cada área usa el equipo disponible en ese momento', impacto: 'Médicos improvisando — riesgo de errores por falta de información' },
          { texto: 'El personal usa sus propios dispositivos personales', impacto: 'Riesgo crítico: datos clínicos en dispositivos sin control institucional' },
          { texto: 'Permitimos dispositivos personales con política básica de acceso', impacto: 'Acceso clínico sin control total — riesgo latente de filtración de datos del paciente' },
        ],
      },
      {
        escenario: 'Médicos, enfermeros y administrativos coordinan por canales separados y se pierde información vital.',
        opciones: [
          { texto: 'Unificamos la comunicación clínica en una sola plataforma', impacto: 'Coordinación en tiempo real — menos errores, más atención al paciente' },
          { texto: 'Usamos WhatsApp y email para urgencias', impacto: 'Información crítica fragmentada en apps sin trazabilidad' },
          { texto: 'Cada área se coordina como puede', impacto: 'Falla en cadena de comunicación — riesgo clínico directo' },
          { texto: 'Adoptamos la plataforma sin capacitar al equipo médico', impacto: 'La comunicación mejora en papel — el equipo sigue usando canales no seguros' },
        ],
      },
      {
        escenario: 'Se detecta acceso no autorizado a historiales clínicos de pacientes.',
        opciones: [
          { texto: 'Bloqueamos el acceso y protegemos los datos del paciente al instante', impacto: 'Cumplimiento legal garantizado. Datos del paciente blindados.' },
          { texto: 'Cambiamos contraseñas y notificamos a IT', impacto: 'Respuesta tardía — posible brecha de datos sensibles' },
          { texto: 'Asumimos que fue un error interno sin impacto', impacto: 'Exposición de datos críticos — riesgo legal y ético grave' },
          { texto: 'Ciframos los historiales pero sin gestión remota de dispositivos', impacto: 'Sin borrado remoto, un equipo perdido compromete datos clínicos críticos' },
        ],
      },
      {
        escenario: 'El sistema de historiales clínicos cae durante una guardia nocturna.',
        opciones: [
          { texto: 'Restauramos el sistema en minutos con respaldo automático', impacto: 'La atención médica continúa sin interrupciones' },
          { texto: 'Recuperamos manualmente con los últimos respaldos disponibles', impacto: 'Horas sin acceso al historial — riesgo directo para pacientes' },
          { texto: 'Documentamos en papel hasta que el sistema vuelva', impacto: 'Pérdida de datos clínicos y exposición a responsabilidad legal' },
          { texto: 'Migramos historiales a la nube sin validar el plan de recuperación', impacto: 'La nube no garantiza acceso si el plan nunca fue probado en producción' },
        ],
      },
      {
        escenario: 'Fallas técnicas recurrentes retrasan la atención y desesperan al personal médico.',
        opciones: [
          { texto: 'Soporte proactivo resuelve antes de afectar la atención al paciente', impacto: 'Cero interrupciones. El médico se enfoca en el paciente.' },
          { texto: 'Llamamos soporte cuando algo falla en guardia', impacto: 'Las fallas en tiempo real ponen en riesgo la continuidad clínica' },
          { texto: 'El personal médico intenta resolver el problema', impacto: 'Horas perdidas. Pacientes en espera por problemas técnicos.' },
          { texto: 'Externalizamos soporte sin SLA específico para entornos clínicos', impacto: 'Soporte que responde, pero no con la urgencia que requiere la atención médica' },
        ],
      },
      {
        escenario: 'El hospital abre nuevas sedes y necesita replicar su infraestructura tecnológica.',
        opciones: [
          { texto: 'Modelo flexible que escala sin caos ni inversión descontrolada', impacto: 'Cada sede operativa y segura desde el primer día' },
          { texto: 'Compramos equipos nuevos para cada sede por separado', impacto: 'Costos no planificados e infraestructura desigual entre sedes' },
          { texto: 'Cada sede se instala con lo que consigue', impacto: 'Infraestructura dispareja — riesgo operativo y de seguridad' },
          { texto: 'Adquirimos tecnología por sede sin integrar con el sistema central', impacto: 'Nuevas sedes tecnológicamente aisladas — datos clínicos fragmentados entre hospitales' },
        ],
      },
    ],
  },

  educacion: {
    id: 'educacion',
    emoji: '🎓',
    nombre: 'Educación',
    color: '#8b5cf6',
    reto_central: 'Garantice el aprendizaje sin interrupciones digitales',
    rondas: [
      {
        escenario: 'Docentes y estudiantes inician clases virtuales con equipos inconsistentes y sin estándar.',
        opciones: [
          { texto: 'Estandarizamos los equipos docentes y los espacios de enseñanza', impacto: 'Las clases fluyen sin interrupciones técnicas' },
          { texto: 'Cada docente usa su propio equipo personal', impacto: 'Las clases se cortan por incompatibilidades técnicas' },
          { texto: 'Docentes y estudiantes improvisan con lo que tienen', impacto: 'El aprendizaje se interrumpe por fallas de hardware' },
          { texto: 'Permitimos equipos personales de docentes con política mínima de acceso', impacto: 'Clases inconsistentes por variaciones de hardware y software entre docentes' },
        ],
      },
      {
        escenario: 'Docentes y estudiantes se comunican por múltiples canales y se pierde información académica clave.',
        opciones: [
          { texto: 'Centralizamos la comunicación académica en una sola plataforma', impacto: 'Docentes y estudiantes siempre conectados y organizados' },
          { texto: 'Usamos WhatsApp, email y plataforma propia en paralelo', impacto: 'Mensajes críticos se pierden — estudiantes desorientados' },
          { texto: 'Cada docente comunica como prefiere', impacto: 'Caos académico — los estudiantes no encuentran la información' },
          { texto: 'Adoptamos la plataforma sin formación para docentes ni estudiantes', impacto: 'La tecnología existe pero la adopción es mínima — frustra más de lo que facilita' },
        ],
      },
      {
        escenario: 'Un dispositivo institucional con datos de estudiantes es accedido por un tercero.',
        opciones: [
          { texto: 'Bloqueamos el acceso remoto y protegemos los datos al instante', impacto: 'Datos de estudiantes protegidos — cumplimiento normativo garantizado' },
          { texto: 'Cambiamos contraseñas y revisamos manualmente', impacto: 'Reacción tardía — posible exposición de datos de menores' },
          { texto: 'Asumimos que no hubo fuga de información', impacto: 'Incumplimiento normativo de protección de datos educativos' },
          { texto: 'Protegemos datos con cifrado pero sin gestión remota de dispositivos', impacto: 'Sin control remoto, un equipo perdido expone datos de estudiantes menores de edad' },
        ],
      },
      {
        escenario: 'La plataforma educativa cae durante un examen final en línea.',
        opciones: [
          { texto: 'Restauramos la plataforma en minutos sin pérdida de respuestas', impacto: 'Los exámenes continúan sin afectar a los estudiantes' },
          { texto: 'Recuperamos el sistema, pero se pierden avances parciales', impacto: 'Estudiantes frustrados — impacto académico significativo' },
          { texto: 'Postergamos el examen hasta que el sistema vuelva', impacto: 'Crisis académica — pérdida de confianza institucional' },
          { texto: 'Respaldamos en la nube pero sin validar la recuperación real', impacto: 'El backup existe pero no fue probado — la recuperación puede fallar en el momento crítico' },
        ],
      },
      {
        escenario: 'Los docentes reportan fallas técnicas que interrumpen clases en tiempo real.',
        opciones: [
          { texto: 'Soporte proactivo resuelve antes de afectar la clase', impacto: 'Cero interrupciones. Docentes enfocados en enseñar.' },
          { texto: 'El soporte responde cuando se reporta el problema', impacto: 'La clase se detiene. Los estudiantes pierden el hilo.' },
          { texto: 'El docente intenta resolver la falla durante la clase', impacto: 'Tiempo de clase perdido — frustración masiva de estudiantes' },
          { texto: 'Contratamos soporte externo sin SLA ajustado a horarios académicos', impacto: 'El soporte llega fuera del horario de clases — las interrupciones persisten' },
        ],
      },
      {
        escenario: 'La institución crece en matrículas y necesita ampliar su infraestructura digital.',
        opciones: [
          { texto: 'Escalamos con un modelo flexible sin inversión de capital desordenada', impacto: 'Nuevos estudiantes integrados sin fricción tecnológica' },
          { texto: 'Compramos más servidores y licencias según la necesidad inmediata', impacto: 'Costos no planificados que impactan el presupuesto académico' },
          { texto: 'Crecemos sin estrategia digital clara', impacto: 'La experiencia educativa se degrada con el crecimiento' },
          { texto: 'Compramos infraestructura nueva sin integrar con la plataforma educativa', impacto: 'Inversión que no conecta con la experiencia del estudiante — retorno educativo nulo' },
        ],
      },
    ],
  },

  corporativo: {
    id: 'corporativo',
    emoji: '🏢',
    nombre: 'Corporativo',
    color: '#3b82f6',
    reto_central: 'Haga que su operación fluya sin fricción',
    rondas: [
      {
        escenario: 'Su empresa adopta modelo híbrido y cada área resuelve sus equipos de forma independiente.',
        opciones: [
          { texto: 'Estandarizamos equipos y espacios de trabajo desde el inicio', impacto: 'Su operación gana coherencia y eficiencia desde el día uno' },
          { texto: 'Cada área compra lo que necesita sin alineación central', impacto: 'Costos invisibles y experiencias de trabajo inconsistentes' },
          { texto: 'Los empleados usan sus propios equipos sin control corporativo', impacto: 'Riesgo de seguridad y productividad fragmentada' },
          { texto: 'Implementamos BYOD con control básico sin monitoreo activo', impacto: 'Empleados remotos sin visibilidad real — brechas de seguridad sin detección' },
        ],
      },
      {
        escenario: 'Su equipo remoto pierde horas coordinando tareas, reuniones y documentos.',
        opciones: [
          { texto: 'Centralizamos toda la operación en una plataforma integrada', impacto: 'La productividad sube — menos reuniones, más resultados' },
          { texto: 'Usamos varias apps según el proyecto o equipo', impacto: 'Los silos digitales cuestan tiempo y generan errores costosos' },
          { texto: 'Cada equipo se organiza como puede', impacto: 'Ineficiencia invisible que sangra productividad y dinero' },
          { texto: 'Adoptamos la plataforma sin migrar los flujos de trabajo actuales', impacto: 'La nueva herramienta convive con los procesos viejos — duplicación y confusión operativa' },
        ],
      },
      {
        escenario: 'Un empleado pierde su laptop con contratos y datos financieros de clientes.',
        opciones: [
          { texto: 'Bloqueamos el dispositivo y protegemos los datos de forma remota', impacto: 'Confidencialidad empresarial protegida sin impacto operativo' },
          { texto: 'Confiamos en las contraseñas y el antivirus instalado', impacto: 'Falsa seguridad — los datos corporativos siguen expuestos' },
          { texto: 'No tenemos control sobre dispositivos remotos', impacto: 'Riesgo de fuga de datos corporativos críticos' },
          { texto: 'Ciframos los dispositivos corporativos sin gestión centralizada remota', impacto: 'Sin borrado remoto, un equipo perdido compromete contratos y datos de clientes' },
        ],
      },
      {
        escenario: 'Un sistema crítico falla durante el cierre financiero del mes.',
        opciones: [
          { texto: 'Restauramos todo en minutos con respaldo automático', impacto: 'El cierre financiero continúa sin pérdida de información' },
          { texto: 'Recuperamos con respaldos manuales parciales', impacto: 'Retraso significativo — costos de paralización ocultos' },
          { texto: 'Esperamos a que el sistema se recupere por sí solo', impacto: 'Posible pérdida de datos financieros críticos' },
          { texto: 'Adoptamos respaldo en la nube sin probar la recuperación en producción', impacto: 'El backup existe en teoría — sin pruebas reales el cierre financiero puede fallar' },
        ],
      },
      {
        escenario: 'Su equipo pierde horas productivas resolviendo problemas técnicos cotidianos.',
        opciones: [
          { texto: 'Soporte proactivo previene fallos antes de que impacten la operación', impacto: 'Cero interrupciones. El equipo se enfoca en generar valor.' },
          { texto: 'Llamamos soporte cuando algo falla', impacto: 'Cada falla cuesta horas de productividad no recuperables' },
          { texto: 'El equipo lo resuelve internamente', impacto: 'Tiempo invertido que no genera valor — dinero disfrazado de esfuerzo' },
          { texto: 'Externalizamos soporte sin acuerdo de nivel de servicio corporativo', impacto: 'Soporte que responde sin tiempos comprometidos — la productividad lo paga' },
        ],
      },
      {
        escenario: 'Su empresa gana un cliente grande y necesita escalar operaciones en 30 días.',
        opciones: [
          { texto: 'Escalamos sin caos gracias a un modelo flexible ya integrado', impacto: 'Nuevos colaboradores productivos desde el primer día' },
          { texto: 'Compramos equipo según lo que el proyecto requiere', impacto: 'Costos no planificados que erosionan el margen del proyecto' },
          { texto: 'Crecemos sin estrategia tecnológica definida', impacto: 'Caos operativo que amenaza la entrega al cliente' },
          { texto: 'Adoptamos SaaS sin integrarlos con los sistemas ERP actuales', impacto: 'Nuevas capacidades aisladas del core del negocio — más fragmentación tecnológica' },
        ],
      },
    ],
  },

  industria: {
    id: 'industria',
    emoji: '🏭',
    nombre: 'Industria',
    color: '#f59e0b',
    reto_central: 'Evite que su operación se detenga',
    rondas: [
      {
        escenario: 'Su planta amplía operaciones y el equipo de campo necesita infraestructura tecnológica confiable.',
        opciones: [
          { texto: 'Estandarizamos los equipos de planta desde el inicio', impacto: 'La operación arranca sin incidentes técnicos' },
          { texto: 'Usamos equipos disponibles en almacén', impacto: 'Incompatibilidades que generan paradas no planificadas' },
          { texto: 'El personal usa lo que tiene disponible', impacto: 'Riesgo operativo crítico desde el primer día de producción' },
          { texto: 'Usamos equipos de almacén con actualizaciones básicas de software', impacto: 'Hardware funcional pero no diseñado para el entorno industrial — riesgo latente' },
        ],
      },
      {
        escenario: 'Supervisores de planta y directivos no tienen visibilidad en tiempo real de la operación.',
        opciones: [
          { texto: 'Integramos planta y dirección en una plataforma de comunicación unificada', impacto: 'Decisiones más rápidas — la planta opera con más agilidad' },
          { texto: 'Usamos reportes periódicos enviados por email', impacto: 'Las decisiones llegan tarde. La planta sigue a ciegas.' },
          { texto: 'Cada área reporta cuando puede', impacto: 'Cero visibilidad operativa — acumulación de problemas silenciosos' },
          { texto: 'Implementamos reportería digital sin integración en tiempo real', impacto: 'Los datos llegan con retraso — la operación industrial siempre reacciona tarde' },
        ],
      },
      {
        escenario: 'Se detecta actividad sospechosa en los sistemas de control de la planta.',
        opciones: [
          { texto: 'Activamos protección de endpoints y aislamos el sistema de control', impacto: 'La planta continúa operando. Amenaza contenida.' },
          { texto: 'Escaneamos con antivirus y monitoreamos manualmente', impacto: 'Respuesta lenta — la amenaza puede propagarse a sistemas críticos' },
          { texto: 'Asumimos que es una alerta falsa', impacto: 'Riesgo crítico: los sistemas de control de planta pueden ser comprometidos' },
          { texto: 'Aplicamos parches de seguridad periódicos sin monitoreo continuo', impacto: 'Ventanas de vulnerabilidad entre actualizaciones — las amenazas no esperan al ciclo' },
        ],
      },
      {
        escenario: 'Una falla en el sistema de gestión detiene la línea de producción.',
        opciones: [
          { texto: 'El sistema se restaura automáticamente en minutos', impacto: 'Tiempo muerto minimizado. La producción retoma al instante.' },
          { texto: 'Recuperamos manualmente desde el último respaldo', impacto: 'Horas de producción perdidas. Costos directos significativos.' },
          { texto: 'Esperamos al soporte externo para restaurar el sistema', impacto: 'Cada hora parada = pérdida directa. Sin estimación de recuperación.' },
          { texto: 'Implementamos respaldo en la nube sin validar restauración en producción', impacto: 'El respaldo existe pero nunca fue probado en condiciones reales de planta' },
        ],
      },
      {
        escenario: 'Fallas técnicas recurrentes interrumpen la producción y el equipo no sabe a quién escalar.',
        opciones: [
          { texto: 'Soporte proactivo monitorea y resuelve antes de que la línea se detenga', impacto: 'La producción fluye sin interrupciones inesperadas' },
          { texto: 'Llamamos soporte externo cuando algo falla en planta', impacto: 'El tiempo de respuesta genera pérdidas directas por planta parada' },
          { texto: 'El equipo de mantenimiento improvisa la solución', impacto: 'Riesgo de empeorar la falla. Tiempo de planta parada: incalculable.' },
          { texto: 'Contratamos soporte externo sin SLA para producción crítica', impacto: 'El tiempo de respuesta no corresponde a la urgencia de una línea de planta parada' },
        ],
      },
      {
        escenario: 'Su planta abre una nueva línea de producción y necesita escalar tecnología sin detener operaciones.',
        opciones: [
          { texto: 'Modelo flexible que escala sin requerir paradas operativas', impacto: 'Nueva línea operativa desde el primer turno' },
          { texto: 'Adquirimos e instalamos equipos nuevos por cada proceso', impacto: 'Tiempo de instalación que retrasa el inicio de operaciones' },
          { texto: 'Improvisamos la integración tecnológica de la nueva línea', impacto: 'Caos en la nueva línea — riesgo de parada total de producción' },
          { texto: 'Compramos equipos estándar sin validar compatibilidad con la nueva línea', impacto: 'Equipos incompatibles detectados en instalación — retrasos e inversión duplicada' },
        ],
      },
    ],
  },

  financiero: {
    id: 'financiero',
    emoji: '🏦',
    nombre: 'Financiero',
    color: '#06b6d4',
    reto_central: 'Proteja cada transacción como si fuera crítica',
    rondas: [
      {
        escenario: 'Su equipo operativo trabaja desde múltiples ubicaciones manejando información financiera sensible.',
        opciones: [
          { texto: 'Estandarizamos equipos con configuraciones de seguridad financiera', impacto: 'Las operaciones corren en entornos seguros y controlados' },
          { texto: 'Cada área adquiere equipos según su necesidad inmediata', impacto: 'Dispositivos heterogéneos sin control — riesgo de cumplimiento regulatorio' },
          { texto: 'Los asesores usan sus propios equipos personales', impacto: 'Datos financieros de clientes expuestos en dispositivos sin gestión' },
          { texto: 'Permitimos dispositivos personales con cifrado instalado manualmente', impacto: 'Sin gestión centralizada — cumplimiento regulatorio imposible de auditar' },
        ],
      },
      {
        escenario: 'Equipos de análisis, operaciones y cumplimiento trabajan con información desincronizada.',
        opciones: [
          { texto: 'Unificamos la comunicación con trazabilidad completa para auditoría', impacto: 'Operaciones y cumplimiento alineados en tiempo real' },
          { texto: 'Nos coordinamos por email y chat según urgencia', impacto: 'La falta de trazabilidad genera riesgos de auditoría' },
          { texto: 'Cada equipo trabaja de forma independiente', impacto: 'Silos de información — riesgo regulatorio inminente' },
          { texto: 'Usamos herramientas de colaboración sin control de trazabilidad financiera', impacto: 'Las decisiones ocurren sin registro auditable — riesgo de incumplimiento regulatorio' },
        ],
      },
      {
        escenario: 'Se detecta un intento de acceso no autorizado a cuentas de clientes.',
        opciones: [
          { texto: 'Bloqueamos el acceso y activamos protocolo de seguridad en minutos', impacto: 'Confianza del cliente preservada. Cumplimiento regulatorio garantizado.' },
          { texto: 'Cambiamos credenciales y alertamos al equipo de IT', impacto: 'Ventana de exposición abierta — posible impacto regulatorio' },
          { texto: 'Monitoreamos para ver si el intento se repite', impacto: 'Brecha activa — riesgo de pérdida de datos y sanciones regulatorias' },
          { texto: 'Bloqueamos el acceso pero sin activar el protocolo regulatorio completo', impacto: 'Contención parcial — la brecha no fue reportada en el tiempo regulatorio exigido' },
        ],
      },
      {
        escenario: 'La plataforma de transacciones cae durante el horario de mayor volumen operativo.',
        opciones: [
          { texto: 'El sistema se restaura automáticamente sin pérdida de transacciones', impacto: 'Disponibilidad total mantenida. Clientes sin impacto.' },
          { texto: 'Activamos el plan de contingencia manual de operaciones', impacto: 'Operaciones parciales — clientes afectados y pérdida de confianza' },
          { texto: 'Esperamos a que el sistema se recupere por sí solo', impacto: 'Pérdida de transacciones. Impacto directo en ingresos y reputación.' },
          { texto: 'Activamos contingencia manual sin notificar a reguladores ni clientes', impacto: 'Operación parcialmente recuperada, pero la falta de transparencia genera riesgo de sanción' },
        ],
      },
      {
        escenario: 'Los asesores reportan fallas en sus herramientas durante la atención a clientes.',
        opciones: [
          { texto: 'Soporte proactivo resuelve antes de que el cliente lo perciba', impacto: 'Operación continua. Experiencia del cliente impecable.' },
          { texto: 'Escalamos el ticket cuando el asesor no puede continuar', impacto: 'El cliente espera. Cada minuto cuesta confianza y negocio.' },
          { texto: 'El asesor improvisa con herramientas alternativas', impacto: 'Atención deficiente — riesgo de pérdida del cliente' },
          { texto: 'Externalizamos soporte sin integrar con los sistemas de cumplimiento', impacto: 'El soporte resuelve lo técnico pero no registra incidencias para auditoría regulatoria' },
        ],
      },
      {
        escenario: 'Su institución lanza nuevos productos financieros digitales y necesita escalar sin riesgo.',
        opciones: [
          { texto: 'Escalamos con modelo que garantiza seguridad y cumplimiento desde el inicio', impacto: 'Nuevos productos disponibles sin interrupciones ni riesgos operativos' },
          { texto: 'Agregamos infraestructura a medida que los productos crecen', impacto: 'Costos no planificados y brechas de seguridad en el escalado' },
          { texto: 'Lanzamos sin revisar el impacto en la infraestructura existente', impacto: 'Riesgo regulatorio y operativo al escalar sin estrategia' },
          { texto: 'Lanzamos productos digitales sin validar cumplimiento regulatorio previo', impacto: 'Crecimiento acelerado con riesgo de incumplimiento en cada transacción nueva' },
        ],
      },
    ],
  },
};
