import { mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'thehustlementor-melsoft',
  location: 'us-east4'
};

export const createMentorshipRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateMentorshipRequest', inputVars);
}
createMentorshipRequestRef.operationName = 'CreateMentorshipRequest';

export function createMentorshipRequest(dcOrVars, vars) {
  return executeMutation(createMentorshipRequestRef(dcOrVars, vars));
}

