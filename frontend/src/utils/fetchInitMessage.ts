import { ethers } from "ethers";
import { openActionContractAddress } from "./constants";
import { PostCreatedEventFormatted } from "./types";

export const fetchInitMessage = (post: PostCreatedEventFormatted) => {
    const actionModules = post.args.postParams.actionModules;
    const index = actionModules.indexOf(openActionContractAddress);
    const actionModuleInitData = post.args.postParams.actionModulesInitDatas[index];
    const encodedInitData = ethers.utils.defaultAbiCoder.decode(
        ["string"],
        actionModuleInitData
    );
    return encodedInitData;
}