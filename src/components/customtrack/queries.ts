export const TEST_QUERY = `
    query BigRequests($bigRequests: [BigRequest!]!) {
        bigRequests(requests: $bigRequests) {
            data
            error {
                errortype,
                message
            }
        }
    }
`;
