[**react-ui**](../../../../../README.md)

***

[react-ui](../../../../../README.md) / [client/src/lib/api-client](../README.md) / mockApiClient

# Variable: mockApiClient

> `const` **mockApiClient**: `object`

Defined in: [client/src/lib/mock-api-client.ts:352](https://github.com/UWA-CITS5206-DMR/react-ui/blob/7050e78c07ed514b5a3e8c4228a2104c7641f592/client/src/lib/mock-api-client.ts#L352)

## Type Declaration

### auth

> **auth**: `object`

#### auth.login()

> **login**(`username`, `password`): `Promise`\<\{ `user`: \{ `id`: `string`; `role`: `string`; `username`: `string`; `password`: `string`; `firstName`: `string`; `lastName`: `string`; `createdAt`: `null` \| `Date`; \}; \}\>

##### Parameters

###### username

`string`

###### password

`string`

##### Returns

`Promise`\<\{ `user`: \{ `id`: `string`; `role`: `string`; `username`: `string`; `password`: `string`; `firstName`: `string`; `lastName`: `string`; `createdAt`: `null` \| `Date`; \}; \}\>

#### auth.session()

> **session**(): `Promise`\<`null` \| \{ `user`: \{ `id`: `string`; `role`: `string`; `username`: `string`; `password`: `string`; `firstName`: `string`; `lastName`: `string`; `createdAt`: `null` \| `Date`; \}; \}\>

##### Returns

`Promise`\<`null` \| \{ `user`: \{ `id`: `string`; `role`: `string`; `username`: `string`; `password`: `string`; `firstName`: `string`; `lastName`: `string`; `createdAt`: `null` \| `Date`; \}; \}\>

### sessions

> **sessions**: `object`

#### sessions.getByInstructor()

> **getByInstructor**(`instructorId`): `Promise`\<`object`[]\>

##### Parameters

###### instructorId

`string`

##### Returns

`Promise`\<`object`[]\>

#### sessions.getById()

> **getById**(`sessionId`): `Promise`\<\{ `id`: `string`; `name`: `string`; `createdAt`: `null` \| `Date`; `instructorId`: `string`; `scenarioId`: `null` \| `string`; `active`: `null` \| `boolean`; `timeRemaining`: `null` \| `number`; \}\>

##### Parameters

###### sessionId

`string`

##### Returns

`Promise`\<\{ `id`: `string`; `name`: `string`; `createdAt`: `null` \| `Date`; `instructorId`: `string`; `scenarioId`: `null` \| `string`; `active`: `null` \| `boolean`; `timeRemaining`: `null` \| `number`; \}\>

#### sessions.getPatients()

> **getPatients**(`sessionId`): `Promise`\<`object`[]\>

##### Parameters

###### sessionId

`string`

##### Returns

`Promise`\<`object`[]\>

#### sessions.getGroups()

> **getGroups**(`sessionId`): `Promise`\<`object`[]\>

##### Parameters

###### sessionId

`string`

##### Returns

`Promise`\<`object`[]\>

#### sessions.createGroup()

> **createGroup**(`sessionId`, `groupData`): `Promise`\<\{ `id`: `string`; `name`: `string`; `description`: `null` \| `string`; `createdAt`: `null` \| `Date`; `sessionId`: `string`; \}\>

##### Parameters

###### sessionId

`string`

###### groupData

`Omit`\<[`Group`](../../../../../shared/schema/type-aliases/Group.md), `"id"` \| `"sessionId"` \| `"createdAt"`\>

##### Returns

`Promise`\<\{ `id`: `string`; `name`: `string`; `description`: `null` \| `string`; `createdAt`: `null` \| `Date`; `sessionId`: `string`; \}\>

#### sessions.getAssets()

> **getAssets**(`sessionId`): `Promise`\<`object`[]\>

##### Parameters

###### sessionId

`string`

##### Returns

`Promise`\<`object`[]\>

#### sessions.createAsset()

> **createAsset**(`sessionId`, `assetData`): `Promise`\<\{ `type`: `string`; `id`: `string`; `sessionId`: `string`; `filename`: `string`; `filePath`: `string`; `uploadedBy`: `string`; `uploadedAt`: `null` \| `Date`; \}\>

##### Parameters

###### sessionId

`string`

###### assetData

`Omit`\<[`Asset`](../../../../../shared/schema/type-aliases/Asset.md), `"id"` \| `"sessionId"`\>

##### Returns

`Promise`\<\{ `type`: `string`; `id`: `string`; `sessionId`: `string`; `filename`: `string`; `filePath`: `string`; `uploadedBy`: `string`; `uploadedAt`: `null` \| `Date`; \}\>

### patients

> **patients**: `object`

#### patients.getById()

> **getById**(`patientId`): `Promise`\<\{ `status`: `string`; `id`: `string`; `location`: `null` \| `string`; `firstName`: `string`; `lastName`: `string`; `createdAt`: `null` \| `Date`; `sessionId`: `null` \| `string`; `mrn`: `string`; `dateOfBirth`: `string`; `gender`: `string`; `chiefComplaint`: `null` \| `string`; \}\>

##### Parameters

###### patientId

`string`

##### Returns

`Promise`\<\{ `status`: `string`; `id`: `string`; `location`: `null` \| `string`; `firstName`: `string`; `lastName`: `string`; `createdAt`: `null` \| `Date`; `sessionId`: `null` \| `string`; `mrn`: `string`; `dateOfBirth`: `string`; `gender`: `string`; `chiefComplaint`: `null` \| `string`; \}\>

#### patients.updateById()

> **updateById**(`patientId`, `updates`): `Promise`\<\{ `status`: `string`; `id`: `string`; `location`: `null` \| `string`; `firstName`: `string`; `lastName`: `string`; `createdAt`: `null` \| `Date`; `sessionId`: `null` \| `string`; `mrn`: `string`; `dateOfBirth`: `string`; `gender`: `string`; `chiefComplaint`: `null` \| `string`; \}\>

##### Parameters

###### patientId

`string`

###### updates

`Partial`\<[`Patient`](../../../../../shared/schema/type-aliases/Patient.md)\>

##### Returns

`Promise`\<\{ `status`: `string`; `id`: `string`; `location`: `null` \| `string`; `firstName`: `string`; `lastName`: `string`; `createdAt`: `null` \| `Date`; `sessionId`: `null` \| `string`; `mrn`: `string`; `dateOfBirth`: `string`; `gender`: `string`; `chiefComplaint`: `null` \| `string`; \}\>

#### patients.getVitals()

> **getVitals**(`patientId`): `Promise`\<`object`[]\>

##### Parameters

###### patientId

`string`

##### Returns

`Promise`\<`object`[]\>

#### patients.getLabs()

> **getLabs**(`patientId`): `Promise`\<`object`[]\>

##### Parameters

###### patientId

`string`

##### Returns

`Promise`\<`object`[]\>

#### patients.getHistory()

> **getHistory**(`patientId`): `Promise`\<`object`[]\>

##### Parameters

###### patientId

`string`

##### Returns

`Promise`\<`object`[]\>

#### patients.getMedications()

> **getMedications**(`patientId`): `Promise`\<`object`[]\>

##### Parameters

###### patientId

`string`

##### Returns

`Promise`\<`object`[]\>

#### patients.getSoapNotes()

> **getSoapNotes**(`patientId`): `Promise`\<`object`[]\>

##### Parameters

###### patientId

`string`

##### Returns

`Promise`\<`object`[]\>

#### patients.createSoapNote()

> **createSoapNote**(`patientId`, `noteData`): `Promise`\<\{ `id`: `string`; `createdAt`: `null` \| `Date`; `patientId`: `string`; `subjective`: `null` \| `string`; `objective`: `null` \| `string`; `assessment`: `null` \| `string`; `plan`: `null` \| `string`; `authorId`: `string`; \}\>

##### Parameters

###### patientId

`string`

###### noteData

`Omit`\<[`SoapNote`](../../../../../shared/schema/type-aliases/SoapNote.md), `"id"` \| `"patientId"` \| `"createdAt"`\>

##### Returns

`Promise`\<\{ `id`: `string`; `createdAt`: `null` \| `Date`; `patientId`: `string`; `subjective`: `null` \| `string`; `objective`: `null` \| `string`; `assessment`: `null` \| `string`; `plan`: `null` \| `string`; `authorId`: `string`; \}\>

#### patients.getOrders()

> **getOrders**(`patientId`): `Promise`\<`object`[]\>

##### Parameters

###### patientId

`string`

##### Returns

`Promise`\<`object`[]\>

#### patients.createOrder()

> **createOrder**(`patientId`, `orderData`): `Promise`\<\{ `status`: `null` \| `string`; `type`: `string`; `id`: `string`; `patientId`: `string`; `orderedAt`: `null` \| `Date`; `completedAt`: `null` \| `Date`; `orderedBy`: `string`; `orderText`: `string`; \}\>

##### Parameters

###### patientId

`string`

###### orderData

`Omit`\<[`Order`](../../../../../shared/schema/type-aliases/Order.md), `"id"` \| `"patientId"`\>

##### Returns

`Promise`\<\{ `status`: `null` \| `string`; `type`: `string`; `id`: `string`; `patientId`: `string`; `orderedAt`: `null` \| `Date`; `completedAt`: `null` \| `Date`; `orderedBy`: `string`; `orderText`: `string`; \}\>

### labResults

> **labResults**: `object`

#### labResults.updateById()

> **updateById**(`labId`, `updates`): `Promise`\<\{ `status`: `null` \| `string`; `id`: `string`; `value`: `string`; `patientId`: `string`; `testName`: `string`; `unit`: `null` \| `string`; `referenceRange`: `null` \| `string`; `orderedAt`: `null` \| `Date`; `completedAt`: `null` \| `Date`; `orderedBy`: `null` \| `string`; \}\>

##### Parameters

###### labId

`string`

###### updates

`Partial`\<[`LabResult`](../../../../../shared/schema/type-aliases/LabResult.md)\>

##### Returns

`Promise`\<\{ `status`: `null` \| `string`; `id`: `string`; `value`: `string`; `patientId`: `string`; `testName`: `string`; `unit`: `null` \| `string`; `referenceRange`: `null` \| `string`; `orderedAt`: `null` \| `Date`; `completedAt`: `null` \| `Date`; `orderedBy`: `null` \| `string`; \}\>

### groups

> **groups**: `object`

#### groups.getMembers()

> **getMembers**(`groupId`): `Promise`\<`object`[]\>

##### Parameters

###### groupId

`string`

##### Returns

`Promise`\<`object`[]\>

#### groups.addMember()

> **addMember**(`groupId`, `memberData`): `Promise`\<\{ `id`: `string`; `userId`: `string`; `joinedAt`: `null` \| `Date`; `groupId`: `string`; \}\>

##### Parameters

###### groupId

`string`

###### memberData

`Omit`\<[`GroupMember`](../../../../../shared/schema/type-aliases/GroupMember.md), `"id"` \| `"groupId"` \| `"joinedAt"`\>

##### Returns

`Promise`\<\{ `id`: `string`; `userId`: `string`; `joinedAt`: `null` \| `Date`; `groupId`: `string`; \}\>

#### groups.getVisibleAssets()

> **getVisibleAssets**(`groupId`): `Promise`\<`object`[]\>

##### Parameters

###### groupId

`string`

##### Returns

`Promise`\<`object`[]\>

#### groups.getAssets()

> **getAssets**(`groupId`): `Promise`\<`object`[]\>

##### Parameters

###### groupId

`string`

##### Returns

`Promise`\<`object`[]\>

### users

> **users**: `object`

#### users.getGroups()

> **getGroups**(`userId`): `Promise`\<`object`[]\>

##### Parameters

###### userId

`string`

##### Returns

`Promise`\<`object`[]\>

### assets

> **assets**: `object`

#### assets.deleteById()

> **deleteById**(`assetId`): `Promise`\<`void`\>

##### Parameters

###### assetId

`string`

##### Returns

`Promise`\<`void`\>

#### assets.getVisibility()

> **getVisibility**(`assetId`, `groupId`): `Promise`\<\{ `id`: `string`; `groupId`: `string`; `assetId`: `string`; `visible`: `null` \| `boolean`; `changedBy`: `string`; `changedAt`: `null` \| `Date`; \}\>

##### Parameters

###### assetId

`string`

###### groupId

`string`

##### Returns

`Promise`\<\{ `id`: `string`; `groupId`: `string`; `assetId`: `string`; `visible`: `null` \| `boolean`; `changedBy`: `string`; `changedAt`: `null` \| `Date`; \}\>

#### assets.updateVisibility()

> **updateVisibility**(`assetId`, `groupId`, `visible`, `changedBy`): `Promise`\<\{ `id`: `string`; `groupId`: `string`; `assetId`: `string`; `visible`: `null` \| `boolean`; `changedBy`: `string`; `changedAt`: `null` \| `Date`; \}\>

##### Parameters

###### assetId

`string`

###### groupId

`string`

###### visible

`boolean`

###### changedBy

`string`

##### Returns

`Promise`\<\{ `id`: `string`; `groupId`: `string`; `assetId`: `string`; `visible`: `null` \| `boolean`; `changedBy`: `string`; `changedAt`: `null` \| `Date`; \}\>

#### assets.bulkUpdateVisibility()

> **bulkUpdateVisibility**(`assetIds`, `groupId`, `visible`, `changedBy`): `Promise`\<`void`\>

##### Parameters

###### assetIds

`string`[]

###### groupId

`string`

###### visible

`boolean`

###### changedBy

`string`

##### Returns

`Promise`\<`void`\>

### admin

> **admin**: `object`

#### admin.users

> **users**: `object`

#### admin.users.getAll()

> **getAll**(): `Promise`\<`object`[]\>

##### Returns

`Promise`\<`object`[]\>

#### admin.users.create()

> **create**(`userData`): `Promise`\<\{ `id`: `string`; `role`: `string`; `username`: `string`; `password`: `string`; `firstName`: `string`; `lastName`: `string`; `createdAt`: `null` \| `Date`; \}\>

##### Parameters

###### userData

`Omit`\<[`User`](../../../../../shared/schema/type-aliases/User.md), `"id"` \| `"createdAt"`\>

##### Returns

`Promise`\<\{ `id`: `string`; `role`: `string`; `username`: `string`; `password`: `string`; `firstName`: `string`; `lastName`: `string`; `createdAt`: `null` \| `Date`; \}\>

#### admin.users.updateById()

> **updateById**(`id`, `updates`): `Promise`\<\{ `id`: `string`; `role`: `string`; `username`: `string`; `password`: `string`; `firstName`: `string`; `lastName`: `string`; `createdAt`: `null` \| `Date`; \}\>

##### Parameters

###### id

`string`

###### updates

`Partial`\<[`User`](../../../../../shared/schema/type-aliases/User.md)\>

##### Returns

`Promise`\<\{ `id`: `string`; `role`: `string`; `username`: `string`; `password`: `string`; `firstName`: `string`; `lastName`: `string`; `createdAt`: `null` \| `Date`; \}\>

#### admin.users.deleteById()

> **deleteById**(`id`): `Promise`\<`void`\>

##### Parameters

###### id

`string`

##### Returns

`Promise`\<`void`\>

#### admin.dataVersions

> **dataVersions**: `object`

#### admin.dataVersions.getAll()

> **getAll**(): `Promise`\<`object`[]\>

##### Returns

`Promise`\<`object`[]\>

#### admin.dataVersions.create()

> **create**(`versionData`): `Promise`\<\{ `id`: `string`; `name`: `string`; `version`: `string`; `description`: `null` \| `string`; `createdAt`: `null` \| `Date`; `createdBy`: `string`; `sessionId`: `string`; \}\>

##### Parameters

###### versionData

`Omit`\<[`DataVersion`](../../../../../shared/schema/type-aliases/DataVersion.md), `"id"` \| `"createdAt"`\>

##### Returns

`Promise`\<\{ `id`: `string`; `name`: `string`; `version`: `string`; `description`: `null` \| `string`; `createdAt`: `null` \| `Date`; `createdBy`: `string`; `sessionId`: `string`; \}\>

#### admin.dataVersions.deleteById()

> **deleteById**(`id`): `Promise`\<`void`\>

##### Parameters

###### id

`string`

##### Returns

`Promise`\<`void`\>

#### admin.groupAccounts

> **groupAccounts**: `object`

#### admin.groupAccounts.getAll()

> **getAll**(): `Promise`\<`object`[]\>

##### Returns

`Promise`\<`object`[]\>

#### admin.groupAccounts.create()

> **create**(`accountData`): `Promise`\<\{ `id`: `string`; `username`: `string`; `password`: `string`; `createdAt`: `null` \| `Date`; `createdBy`: `string`; `active`: `null` \| `boolean`; `groupId`: `string`; \}\>

##### Parameters

###### accountData

`Omit`\<[`GroupAccount`](../../../../../shared/schema/type-aliases/GroupAccount.md), `"id"` \| `"createdAt"`\>

##### Returns

`Promise`\<\{ `id`: `string`; `username`: `string`; `password`: `string`; `createdAt`: `null` \| `Date`; `createdBy`: `string`; `active`: `null` \| `boolean`; `groupId`: `string`; \}\>

#### admin.groupAccounts.updateById()

> **updateById**(`id`, `updates`): `Promise`\<\{ `id`: `string`; `username`: `string`; `password`: `string`; `createdAt`: `null` \| `Date`; `createdBy`: `string`; `active`: `null` \| `boolean`; `groupId`: `string`; \}\>

##### Parameters

###### id

`string`

###### updates

`Partial`\<[`GroupAccount`](../../../../../shared/schema/type-aliases/GroupAccount.md)\>

##### Returns

`Promise`\<\{ `id`: `string`; `username`: `string`; `password`: `string`; `createdAt`: `null` \| `Date`; `createdBy`: `string`; `active`: `null` \| `boolean`; `groupId`: `string`; \}\>

#### admin.groupAccounts.deactivateById()

> **deactivateById**(`id`): `Promise`\<`void`\>

##### Parameters

###### id

`string`

##### Returns

`Promise`\<`void`\>

#### admin.auditLogs

> **auditLogs**: `object`

#### admin.auditLogs.getAll()

> **getAll**(): `Promise`\<`object`[]\>

##### Returns

`Promise`\<`object`[]\>

### coordinator

> **coordinator**: `object`

#### coordinator.documents

> **documents**: `object`

#### coordinator.documents.getAll()

> **getAll**(): `Promise`\<`object`[]\>

##### Returns

`Promise`\<`object`[]\>

#### coordinator.documents.upload()

> **upload**(`documentData`): `Promise`\<\{ `id`: `string`; `sessionId`: `string`; `patientId`: `null` \| `string`; `filename`: `string`; `filePath`: `string`; `uploadedBy`: `string`; `uploadedAt`: `null` \| `Date`; `originalName`: `string`; `fileType`: `string`; `fileSize`: `number`; `category`: `string`; \}\>

##### Parameters

###### documentData

`any`

##### Returns

`Promise`\<\{ `id`: `string`; `sessionId`: `string`; `patientId`: `null` \| `string`; `filename`: `string`; `filePath`: `string`; `uploadedBy`: `string`; `uploadedAt`: `null` \| `Date`; `originalName`: `string`; `fileType`: `string`; `fileSize`: `number`; `category`: `string`; \}\>

#### coordinator.documents.deleteById()

> **deleteById**(`id`): `Promise`\<`void`\>

##### Parameters

###### id

`string`

##### Returns

`Promise`\<`void`\>

#### coordinator.documentReleases

> **documentReleases**: `object`

#### coordinator.documentReleases.getAll()

> **getAll**(): `Promise`\<`object`[]\>

##### Returns

`Promise`\<`object`[]\>

#### coordinator.documentReleases.create()

> **create**(`releaseData`): `Promise`\<\{ `status`: `null` \| `string`; `id`: `string`; `notes`: `null` \| `string`; `groupId`: `string`; `documentId`: `string`; `releaseType`: `string`; `scheduledAt`: `null` \| `Date`; `releasedAt`: `null` \| `Date`; `releasedBy`: `null` \| `string`; \}\>

##### Parameters

###### releaseData

`any`

##### Returns

`Promise`\<\{ `status`: `null` \| `string`; `id`: `string`; `notes`: `null` \| `string`; `groupId`: `string`; `documentId`: `string`; `releaseType`: `string`; `scheduledAt`: `null` \| `Date`; `releasedAt`: `null` \| `Date`; `releasedBy`: `null` \| `string`; \}\>

#### coordinator.documentReleases.release()

> **release**(`id`): `Promise`\<\{ `status`: `null` \| `string`; `id`: `string`; `notes`: `null` \| `string`; `groupId`: `string`; `documentId`: `string`; `releaseType`: `string`; `scheduledAt`: `null` \| `Date`; `releasedAt`: `null` \| `Date`; `releasedBy`: `null` \| `string`; \}\>

##### Parameters

###### id

`string`

##### Returns

`Promise`\<\{ `status`: `null` \| `string`; `id`: `string`; `notes`: `null` \| `string`; `groupId`: `string`; `documentId`: `string`; `releaseType`: `string`; `scheduledAt`: `null` \| `Date`; `releasedAt`: `null` \| `Date`; `releasedBy`: `null` \| `string`; \}\>

#### coordinator.documentReleases.cancel()

> **cancel**(`id`): `Promise`\<`void`\>

##### Parameters

###### id

`string`

##### Returns

`Promise`\<`void`\>

#### coordinator.simulationWeeks

> **simulationWeeks**: `object`

#### coordinator.simulationWeeks.getAll()

> **getAll**(): `Promise`\<`object`[]\>

##### Returns

`Promise`\<`object`[]\>

#### coordinator.simulationWeeks.create()

> **create**(`weekData`): `Promise`\<\{ `id`: `string`; `name`: `string`; `createdAt`: `null` \| `Date`; `createdBy`: `string`; `timeline`: `null` \| `string`; `active`: `null` \| `boolean`; `sessionId`: `string`; `weekNumber`: `number`; `startDate`: `Date`; `endDate`: `Date`; \}\>

##### Parameters

###### weekData

`any`

##### Returns

`Promise`\<\{ `id`: `string`; `name`: `string`; `createdAt`: `null` \| `Date`; `createdBy`: `string`; `timeline`: `null` \| `string`; `active`: `null` \| `boolean`; `sessionId`: `string`; `weekNumber`: `number`; `startDate`: `Date`; `endDate`: `Date`; \}\>

#### coordinator.simulationWeeks.activate()

> **activate**(`id`): `Promise`\<\{ `id`: `string`; `name`: `string`; `createdAt`: `null` \| `Date`; `createdBy`: `string`; `timeline`: `null` \| `string`; `active`: `null` \| `boolean`; `sessionId`: `string`; `weekNumber`: `number`; `startDate`: `Date`; `endDate`: `Date`; \}\>

##### Parameters

###### id

`string`

##### Returns

`Promise`\<\{ `id`: `string`; `name`: `string`; `createdAt`: `null` \| `Date`; `createdBy`: `string`; `timeline`: `null` \| `string`; `active`: `null` \| `boolean`; `sessionId`: `string`; `weekNumber`: `number`; `startDate`: `Date`; `endDate`: `Date`; \}\>

#### coordinator.simulationWeeks.updateById()

> **updateById**(`id`, `updates`): `Promise`\<\{ `id`: `string`; `name`: `string`; `createdAt`: `null` \| `Date`; `createdBy`: `string`; `timeline`: `null` \| `string`; `active`: `null` \| `boolean`; `sessionId`: `string`; `weekNumber`: `number`; `startDate`: `Date`; `endDate`: `Date`; \}\>

##### Parameters

###### id

`string`

###### updates

`any`

##### Returns

`Promise`\<\{ `id`: `string`; `name`: `string`; `createdAt`: `null` \| `Date`; `createdBy`: `string`; `timeline`: `null` \| `string`; `active`: `null` \| `boolean`; `sessionId`: `string`; `weekNumber`: `number`; `startDate`: `Date`; `endDate`: `Date`; \}\>
