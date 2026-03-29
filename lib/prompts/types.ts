import { z } from "zod";

const riskLevelSchema = z.enum(["rojo", "amarillo", "verde"]);

const clauseCategorySchema = z.enum([
  "duracion",
  "renta_y_pagos",
  "fianza_y_garantias",
  "mantenimiento_y_reparaciones",
  "suministros",
  "subarriendo",
  "obras_y_modificaciones",
  "resolucion_y_penalizaciones",
  "actualizacion_renta",
  "derecho_adquisicion_preferente",
  "uso_del_inmueble",
  "seguros",
  "proteccion_datos",
  "jurisdiccion",
  "otro",
]);

const clauseAnalysisSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  textoOriginal: z.string(),
  categoria: z.string(),
  nivelRiesgo: riskLevelSchema,
  puntuacionRiesgo: z.number().min(0).max(100),
  explicacion: z.string(),
  referenciaLegal: z.string(),
  comparacionEstandar: z.string(),
  recomendacion: z.string(),
});

const missingClauseSchema = z.object({
  titulo: z.string(),
  categoria: z.string(),
  nivelRiesgo: z.enum(["rojo", "amarillo"]),
  explicacion: z.string(),
  referenciaLegal: z.string(),
  textoSugerido: z.string(),
});

const executiveSummarySchema = z.object({
  puntuacionRiesgoGlobal: z.number().min(0).max(100),
  nivelRiesgoGlobal: riskLevelSchema,
  resumenGeneral: z.string(),
  hallazgosPrincipales: z.array(z.string()),
  accionesRecomendadas: z.array(z.string()),
  advertenciasCriticas: z.array(z.string()),
});

export const contractAnalysisSchema = z.object({
  tipoContrato: z.string(),
  resumenEjecutivo: executiveSummarySchema,
  clausulasAnalizadas: z.array(clauseAnalysisSchema),
  clausulasAusentes: z.array(missingClauseSchema),
  metadatos: z.object({
    totalClausulas: z.number(),
    clausulasRojas: z.number(),
    clausulasAmarillas: z.number(),
    clausulasVerdes: z.number(),
    clausulasAusentes: z.number(),
    longitudTextoOriginal: z.number(),
  }),
});
