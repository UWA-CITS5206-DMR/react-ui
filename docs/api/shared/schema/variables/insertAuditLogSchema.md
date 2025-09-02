[**react-ui**](../../../README.md)

***

[react-ui](../../../README.md) / [shared/schema](../README.md) / insertAuditLogSchema

# Variable: insertAuditLogSchema

> `const` **insertAuditLogSchema**: `ZodObject`\<`Omit`\<\{ `id`: `ZodOptional`\<`ZodString`\>; `action`: `ZodString`; `entityType`: `ZodString`; `entityId`: `ZodString`; `performedBy`: `ZodString`; `details`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `timestamp`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; \}, `"id"` \| `"timestamp"`\>, `"strip"`, `ZodTypeAny`, \{ `action`: `string`; `entityType`: `string`; `entityId`: `string`; `performedBy`: `string`; `details?`: `null` \| `string`; \}, \{ `action`: `string`; `entityType`: `string`; `entityId`: `string`; `performedBy`: `string`; `details?`: `null` \| `string`; \}\>

Defined in: [shared/schema.ts:334](https://github.com/UWA-CITS5206-DMR/react-ui/blob/7050e78c07ed514b5a3e8c4228a2104c7641f592/shared/schema.ts#L334)
