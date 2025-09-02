[**react-ui**](../../../README.md)

***

[react-ui](../../../README.md) / [shared/schema](../README.md) / insertOrderSchema

# Variable: insertOrderSchema

> `const` **insertOrderSchema**: `ZodObject`\<`Omit`\<\{ `id`: `ZodOptional`\<`ZodString`\>; `patientId`: `ZodString`; `type`: `ZodString`; `orderText`: `ZodString`; `status`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `orderedBy`: `ZodString`; `orderedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `completedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; \}, `"id"` \| `"orderedAt"`\>, `"strip"`, `ZodTypeAny`, \{ `patientId`: `string`; `type`: `string`; `orderText`: `string`; `status?`: `null` \| `string`; `orderedBy`: `string`; `completedAt?`: `null` \| `Date`; \}, \{ `patientId`: `string`; `type`: `string`; `orderText`: `string`; `status?`: `null` \| `string`; `orderedBy`: `string`; `completedAt?`: `null` \| `Date`; \}\>

Defined in: [shared/schema.ts:271](https://github.com/UWA-CITS5206-DMR/react-ui/blob/7050e78c07ed514b5a3e8c4228a2104c7641f592/shared/schema.ts#L271)
