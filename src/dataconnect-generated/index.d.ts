import { ConnectorConfig, DataConnect, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface BusinessProfile_Key {
  id: UUIDString;
  __typename?: 'BusinessProfile_Key';
}

export interface CreateMentorshipRequestData {
  mentorshipRequest_insert: MentorshipRequest_Key;
}

export interface CreateMentorshipRequestVariables {
  mentorId: UUIDString;
  meetingPreference?: string | null;
  message: string;
}

export interface Mentor_Key {
  id: UUIDString;
  __typename?: 'Mentor_Key';
}

export interface MentorshipRequest_Key {
  id: UUIDString;
  __typename?: 'MentorshipRequest_Key';
}

export interface Project_Key {
  id: UUIDString;
  __typename?: 'Project_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateMentorshipRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMentorshipRequestVariables): MutationRef<CreateMentorshipRequestData, CreateMentorshipRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateMentorshipRequestVariables): MutationRef<CreateMentorshipRequestData, CreateMentorshipRequestVariables>;
  operationName: string;
}
export const createMentorshipRequestRef: CreateMentorshipRequestRef;

export function createMentorshipRequest(vars: CreateMentorshipRequestVariables): MutationPromise<CreateMentorshipRequestData, CreateMentorshipRequestVariables>;
export function createMentorshipRequest(dc: DataConnect, vars: CreateMentorshipRequestVariables): MutationPromise<CreateMentorshipRequestData, CreateMentorshipRequestVariables>;

