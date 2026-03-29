export type RiskLevel = "rojo" | "amarillo" | "verde";

export type ClauseCategory =
  | "duracion"
  | "renta_y_pagos"
  | "fianza_y_garantias"
  | "mantenimiento_y_reparaciones"
  | "suministros"
  | "subarriendo"
  | "obras_y_modificaciones"
  | "resolucion_y_penalizaciones"
  | "actualizacion_renta"
  | "derecho_adquisicion_preferente"
  | "uso_del_inmueble"
  | "seguros"
  | "proteccion_datos"
  | "jurisdiccion"
  | "otro";

export interface ClauseAnalysis {
  id: string;
  titulo: string;
  textoOriginal: string;
  categoria: ClauseCategory;
  nivelRiesgo: RiskLevel;
  puntuacionRiesgo: number;
  explicacion: string;
  referenciaLegal: string;
  comparacionEstandar: string;
  recomendacion: string;
}

export interface MissingClause {
  titulo: string;
  categoria: ClauseCategory;
  nivelRiesgo: "rojo" | "amarillo";
  explicacion: string;
  referenciaLegal: string;
  textoSugerido: string;
}

export interface ExecutiveSummary {
  puntuacionRiesgoGlobal: number;
  nivelRiesgoGlobal: RiskLevel;
  resumenGeneral: string;
  hallazgosPrincipales: string[];
  accionesRecomendadas: string[];
  advertenciasCriticas: string[];
}

export interface ContractAnalysis {
  tipoContrato: string;
  fechaAnalisis: string;
  resumenEjecutivo: ExecutiveSummary;
  clausulasAnalizadas: ClauseAnalysis[];
  clausulasAusentes: MissingClause[];
  metadatos: {
    totalClausulas: number;
    clausulasRojas: number;
    clausulasAmarillas: number;
    clausulasVerdes: number;
    clausulasAusentes: number;
    longitudTextoOriginal: number;
  };
}

export type ContractType =
  | "alquiler_vivienda"
  | "alquiler_local_comercial"
  | "alquiler_temporal"
  | "otro";

export interface AnalysisError {
  code: string;
  message: string;
}

export type PageState =
  | { step: "upload" }
  | { step: "loading"; abortController: AbortController }
  | { step: "results"; analysis: ContractAnalysis }
  | { step: "error"; error: AnalysisError };
