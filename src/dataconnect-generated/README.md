# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
- [**Mutations**](#mutations)
  - [*CreateMentorshipRequest*](#creatementorshiprequest)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

No queries were generated for the `example` connector.

If you want to learn more about how to use queries in Data Connect, you can follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateMentorshipRequest
You can execute the `CreateMentorshipRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createMentorshipRequest(vars: CreateMentorshipRequestVariables): MutationPromise<CreateMentorshipRequestData, CreateMentorshipRequestVariables>;

interface CreateMentorshipRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMentorshipRequestVariables): MutationRef<CreateMentorshipRequestData, CreateMentorshipRequestVariables>;
}
export const createMentorshipRequestRef: CreateMentorshipRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createMentorshipRequest(dc: DataConnect, vars: CreateMentorshipRequestVariables): MutationPromise<CreateMentorshipRequestData, CreateMentorshipRequestVariables>;

interface CreateMentorshipRequestRef {
  ...
  (dc: DataConnect, vars: CreateMentorshipRequestVariables): MutationRef<CreateMentorshipRequestData, CreateMentorshipRequestVariables>;
}
export const createMentorshipRequestRef: CreateMentorshipRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createMentorshipRequestRef:
```typescript
const name = createMentorshipRequestRef.operationName;
console.log(name);
```

### Variables
The `CreateMentorshipRequest` mutation requires an argument of type `CreateMentorshipRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateMentorshipRequestVariables {
  mentorId: UUIDString;
  meetingPreference?: string | null;
  message: string;
}
```
### Return Type
Recall that executing the `CreateMentorshipRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateMentorshipRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateMentorshipRequestData {
  mentorshipRequest_insert: MentorshipRequest_Key;
}
```
### Using `CreateMentorshipRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createMentorshipRequest, CreateMentorshipRequestVariables } from '@dataconnect/generated';

// The `CreateMentorshipRequest` mutation requires an argument of type `CreateMentorshipRequestVariables`:
const createMentorshipRequestVars: CreateMentorshipRequestVariables = {
  mentorId: ..., 
  meetingPreference: ..., // optional
  message: ..., 
};

// Call the `createMentorshipRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createMentorshipRequest(createMentorshipRequestVars);
// Variables can be defined inline as well.
const { data } = await createMentorshipRequest({ mentorId: ..., meetingPreference: ..., message: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createMentorshipRequest(dataConnect, createMentorshipRequestVars);

console.log(data.mentorshipRequest_insert);

// Or, you can use the `Promise` API.
createMentorshipRequest(createMentorshipRequestVars).then((response) => {
  const data = response.data;
  console.log(data.mentorshipRequest_insert);
});
```

### Using `CreateMentorshipRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createMentorshipRequestRef, CreateMentorshipRequestVariables } from '@dataconnect/generated';

// The `CreateMentorshipRequest` mutation requires an argument of type `CreateMentorshipRequestVariables`:
const createMentorshipRequestVars: CreateMentorshipRequestVariables = {
  mentorId: ..., 
  meetingPreference: ..., // optional
  message: ..., 
};

// Call the `createMentorshipRequestRef()` function to get a reference to the mutation.
const ref = createMentorshipRequestRef(createMentorshipRequestVars);
// Variables can be defined inline as well.
const ref = createMentorshipRequestRef({ mentorId: ..., meetingPreference: ..., message: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createMentorshipRequestRef(dataConnect, createMentorshipRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.mentorshipRequest_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.mentorshipRequest_insert);
});
```

