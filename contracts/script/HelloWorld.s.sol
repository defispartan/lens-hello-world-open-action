// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {HelloWorldOpenAction} from "src/HelloWorldOpenAction.sol";
import {HelloWorld} from "src/HelloWorld.sol";
import {IHelloWorld} from "src/interfaces/IHelloWorld.sol";

contract HelloWorldScript is Script {
    function setUp() public {}

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        IHelloWorld helloWorld = new HelloWorld();
        address lensHubProxyAddress = 0xC1E77eE73403B8a7478884915aA599932A677870;

        new HelloWorldOpenAction(lensHubProxyAddress, address(helloWorld));

        vm.stopBroadcast();
    }
}
