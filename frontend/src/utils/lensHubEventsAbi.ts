export const lensHubEventsAbi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "profileId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "contentURI",
                        "type": "string"
                    },
                    {
                        "internalType": "address[]",
                        "name": "actionModules",
                        "type": "address[]"
                    },
                    {
                        "internalType": "bytes[]",
                        "name": "actionModulesInitDatas",
                        "type": "bytes[]"
                    },
                    {
                        "internalType": "address",
                        "name": "referenceModule",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "referenceModuleInitData",
                        "type": "bytes"
                    }
                ],
                "indexed": false,
                "internalType": "struct Types.PostParams",
                "name": "postParams",
                "type": "tuple"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "pubId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bytes[]",
                "name": "actionModulesInitReturnDatas",
                "type": "bytes[]"
            },
            {
                "indexed": false,
                "internalType": "bytes",
                "name": "referenceModuleInitReturnData",
                "type": "bytes"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "transactionExecutor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "PostCreated",
        "type": "event"
    },
] as const;