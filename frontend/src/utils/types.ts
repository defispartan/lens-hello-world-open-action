export type PostCreatedEvent = {
    args: {
        postParams: {
            profileId: number;
            contentURI: string;
            actionModules: string[];
            actionModulesInitDatas: string[];
            referenceModule: string;
            referenceModuleInitData: string;
        };
        pubId: number;
        actionModulesInitReturnDatas: string[];
        referenceModuleInitReturnData: string;
        transactionExecutor: string;
        timestamp: number;
    };
    blockNumber: number;
    transactionHash: string;
};

export type PostCreatedEventFormatted = {
    args: {
        postParams: {
            profileId: string;
            contentURI: string;
            actionModules: string[];
            actionModulesInitDatas: string[];
            referenceModule: string;
            referenceModuleInitData: string;
        };
        pubId: string;
        actionModulesInitReturnDatas: string[];
        referenceModuleInitReturnData: string;
        transactionExecutor: string;
        timestamp: string;
    };
    blockNumber: string;
    transactionHash: string;
};

export type GreetEvent = {
    args: {
        message: string;
        actor: string;
    }
    blockNumber: number;
    transactionHash: string;
}

export type GreetEventFormatted = {
    args: {
        message: string;
        actor: string;
    }
    blockNumber: string;
    transactionHash: string;
}

export function convertPostEventToSerializable(
    event: PostCreatedEvent
): PostCreatedEventFormatted {
    return {
        ...event,
        args: {
            ...event.args,
            postParams: {
                ...event.args.postParams,
                profileId: event.args.postParams.profileId.toString(),
            },
            pubId: event.args.pubId.toString(),
            timestamp: event.args.timestamp.toString(),
        },
        blockNumber: event.blockNumber.toString(),
    };
}

export function convertGreetEventToSerializable(
    event: GreetEvent
): GreetEventFormatted {
    return {
        ...event,
        blockNumber: event.blockNumber.toString(),
    };
}

export type LoginData = {
    handle: {
        localName: string;
    };
    id: string;
    ownedBy: {
        address: string;
    };
};