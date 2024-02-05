pragma solidity ^0.8.0;

import {EntryPoint} from "@account-abstraction/contracts/core/EntryPoint.sol";
import {IAccount} from "@account-abstraction/contracts/interfaces/IAccount.sol";
import {UserOperation} from "@account-abstraction/contracts/interfaces/UserOperation.sol";

contract Account is IAccount {
    uint256 public count;
    address public immutable i_owner;

    constructor(address owner) {
        i_owner = owner;
    }

    function validateUserOp(UserOperation calldata userOp, bytes32, uint256)
        external
        pure
        returns (uint256 validationData)
    {
        return 0;
    }

    function execute() external {
        count++;
    }
}

contract AccountFactory {
    function createAccount(address owner) external returns (address) {
        Account acc = new Account(owner);
        return address(acc);
    }
}
