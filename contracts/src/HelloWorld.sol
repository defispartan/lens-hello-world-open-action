// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IHelloWorld} from "./interfaces/IHelloWorld.sol";

contract HelloWorld is IHelloWorld {
    event Greet(string message);

    function helloWorld(string memory message) public {
        emit Greet(string(abi.encodePacked("Hello, World! ", message)));
    }
}