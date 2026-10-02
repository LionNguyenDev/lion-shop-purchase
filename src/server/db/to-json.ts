import type { Schema } from 'mongoose';

/** Expose `id` instead of `_id`, drop `__v` and `hide` fields whenever a document is serialized. */
export function toJSONPlugin(schema: Schema, options: { hide?: string[] } = {}) {
  schema.set('toJSON', {
    virtuals: false,
    versionKey: false,
    transform: (_doc, ret: Record<string, unknown>) => {
      if (ret._id) {
        ret.id = String(ret._id);
        ret._id = undefined;
      }
      for (const field of options.hide ?? []) ret[field] = undefined;
      return ret;
    },
  });
}
