import { CreateMentorshipRequestData, CreateMentorshipRequestVariables } from '../';
import { UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateMentorshipRequest(options?: useDataConnectMutationOptions<CreateMentorshipRequestData, FirebaseError, CreateMentorshipRequestVariables>): UseDataConnectMutationResult<CreateMentorshipRequestData, CreateMentorshipRequestVariables>;
export function useCreateMentorshipRequest(dc: DataConnect, options?: useDataConnectMutationOptions<CreateMentorshipRequestData, FirebaseError, CreateMentorshipRequestVariables>): UseDataConnectMutationResult<CreateMentorshipRequestData, CreateMentorshipRequestVariables>;
