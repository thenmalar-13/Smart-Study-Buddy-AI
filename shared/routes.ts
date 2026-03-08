import { z } from 'zod';
import { insertStudySessionSchema, insertConceptExplanationSchema, studySessions, conceptExplanations } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  sessions: {
    list: {
      method: 'GET' as const,
      path: '/api/sessions' as const,
      responses: {
        200: z.array(z.custom<typeof studySessions.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/sessions/:id' as const,
      responses: {
        200: z.custom<typeof studySessions.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/sessions' as const,
      input: insertStudySessionSchema,
      responses: {
        201: z.custom<typeof studySessions.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/sessions/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    }
  },
  concepts: {
    list: {
      method: 'GET' as const,
      path: '/api/concepts' as const,
      responses: {
        200: z.array(z.custom<typeof conceptExplanations.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/concepts' as const,
      input: insertConceptExplanationSchema,
      responses: {
        201: z.custom<typeof conceptExplanations.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type StudySessionResponse = z.infer<typeof api.sessions.create.responses[201]>;
export type ConceptExplanationResponse = z.infer<typeof api.concepts.create.responses[201]>;
