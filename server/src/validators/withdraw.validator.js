import { z } from 'zod';

export const withdrawSchema = z.object({
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, ''))
    .pipe(
      z
        .string()
        .regex(/^(\+263|0)7[1-8][0-9]{7}$/, 'Use a valid EcoCash mobile number')
    ),
  pin: z
    .string()
    .trim()
    .regex(/^\d{4,6}$/, 'PIN must be 4 to 6 digits')
});
