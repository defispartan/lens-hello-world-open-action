export const lensHubAbi = [
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "publicationActedProfileId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "publicationActedId",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "actorProfileId", type: "uint256" },
                    {
                        internalType: "uint256[]",
                        name: "referrerProfileIds",
                        type: "uint256[]",
                    },
                    {
                        internalType: "uint256[]",
                        name: "referrerPubIds",
                        type: "uint256[]",
                    },
                    {
                        internalType: "address",
                        name: "actionModuleAddress",
                        type: "address",
                    },
                    { internalType: "bytes", name: "actionModuleData", type: "bytes" },
                ],
                internalType: "struct Types.PublicationActionParams",
                name: "publicationActionParams",
                type: "tuple",
            },
        ],
        name: "act",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint256", name: "profileId", type: "uint256" },
                    { internalType: "string", name: "contentURI", type: "string" },
                    {
                        internalType: "address[]",
                        name: "actionModules",
                        type: "address[]",
                    },
                    {
                        internalType: "bytes[]",
                        name: "actionModulesInitDatas",
                        type: "bytes[]",
                    },
                    { internalType: "address", name: "referenceModule", type: "address" },
                    {
                        internalType: "bytes",
                        name: "referenceModuleInitData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Types.PostParams",
                name: "postParams",
                type: "tuple",
            },
        ],
        name: "post",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;
