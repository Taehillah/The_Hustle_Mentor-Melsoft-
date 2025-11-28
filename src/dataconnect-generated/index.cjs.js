const { mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'thehustlementor-melsoft',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createMentorshipRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateMentorshipRequest', inputVars);
}
createMentorshipRequestRef.operationName = 'CreateMentorshipRequest';
exports.createMentorshipRequestRef = createMentorshipRequestRef;

exports.createMentorshipRequest = function createMentorshipRequest(dcOrVars, vars) {
  return executeMutation(createMentorshipRequestRef(dcOrVars, vars));
};
