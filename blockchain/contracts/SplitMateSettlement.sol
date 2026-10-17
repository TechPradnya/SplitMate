
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title SplitMate Shared Expense Settlements
/// @notice Allows users to settle shared expenses using testnet ETH.
contract SplitMateSettlement {
    uint256 private unlocked = 1;

    struct Settlement {
        address payer;
        address recipient;
        uint256 amount;
        string groupName;
        uint256 timestamp;
    }

    Settlement[] private settlements;

    event SettlementCompleted(
        uint256 indexed settlementId,
        address indexed payer,
        address indexed recipient,
        uint256 amount,
        string groupName,
        uint256 timestamp
    );

    modifier nonReentrant() {
        require(unlocked == 1, "Transaction already in progress");
        unlocked = 2;
        _;
        unlocked = 1;
    }

    /// @notice Pay another wallet to settle a shared expense.
    /// @param recipient Wallet address receiving the payment.
    /// @param groupName Name of the shared expense group.
    function settle(
        address payable recipient,
        string calldata groupName
    ) external payable nonReentrant {
        require(recipient != address(0), "Invalid recipient");
        require(recipient != msg.sender, "Cannot pay yourself");
        require(msg.value > 0, "Payment must be greater than zero");
        require(bytes(groupName).length > 0, "Group name is required");

        (bool success, ) = recipient.call{value: msg.value}("");
        require(success, "Payment transfer failed");

        uint256 settlementId = settlements.length;

        settlements.push(
            Settlement({
                payer: msg.sender,
                recipient: recipient,
                amount: msg.value,
                groupName: groupName,
                timestamp: block.timestamp
            })
        );

        emit SettlementCompleted(
            settlementId,
            msg.sender,
            recipient,
            msg.value,
            groupName,
            block.timestamp
        );
    }

    /// @notice Return the total number of recorded settlements.
    function getSettlementCount() external view returns (uint256) {
        return settlements.length;
    }

    /// @notice Return a recorded settlement by its ID.
    function getSettlement(
        uint256 settlementId
    ) external view returns (Settlement memory) {
        require(settlementId < settlements.length, "Settlement not found");
        return settlements[settlementId];
    }
}
