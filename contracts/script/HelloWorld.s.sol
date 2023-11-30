// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {HelloWorldOpenAction} from "src/HelloWorldOpenAction.sol";
import {HelloWorld} from "src/HelloWorld.sol";
import {IHelloWorld} from "src/IHelloWorld.sol";

contract HelloWorldScript is Script {
    function setUp() public {}

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address moduleOwner = vm.envAddress("MODULE_OWNER");
        vm.startBroadcast(deployerPrivateKey);

        IHelloWorld helloWorld = new HelloWorld();
        address lensHubProxyAddress = vm.envAddress("LENS_HUB_PROXY");

        new HelloWorldOpenAction(lensHubProxyAddress, address(helloWorld), address(moduleOwner));

        vm.stopBroadcast();
    }
}
